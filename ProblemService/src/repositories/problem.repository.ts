import { Types, FilterQuery, PipelineStage } from "mongoose";
import Problem from "../models/problem";
import { IProblem } from "../types/problem.types";
import BaseRepository from "./base.repository";

export class ProblemRepository extends BaseRepository<IProblem> {
    constructor() {
        super(Problem);
    }

    // Build MongoDB filter based on query params
    private buildFilter(params: {
        q?: string;
        slug?: string;
        difficultyIn?: ("Easy" | "Medium" | "Hard")[];
        tagsIn?: string[];
        companyIn?: string[]; // company ObjectIds as strings
        isPremium?: boolean;
        isActiveIn?: boolean[];
    } = {}): FilterQuery<IProblem> {
        const filter: FilterQuery<IProblem> = {};
        const { q, slug, difficultyIn, tagsIn, companyIn, isPremium, isActiveIn } = params;
        if (q) {
            filter.$text = { $search: q } as any;
        }
        if (slug) {
            filter.slug = slug.toLowerCase();
        }
        if (difficultyIn && difficultyIn.length) {
            filter.difficulty = { $in: difficultyIn } as any;
        }
        if (tagsIn && tagsIn.length) {
            filter.tags = { $in: tagsIn } as any;
        }
        if (companyIn && companyIn.length) {
            filter.companies = { $in: companyIn.map((id) => new Types.ObjectId(id)) } as any;
        }
        if (typeof isPremium === "boolean") {
            filter.isPremium = isPremium;
        }
        if (isActiveIn && isActiveIn.length) {
            filter.isActive = { $in: isActiveIn } as any;
        }
        return filter;
    }

    // GET /problems
    async listProblems(params: {
        q?: string;
        slug?: string;
        difficultyIn?: ("Easy" | "Medium" | "Hard")[];
        tagsIn?: string[];
        companyIn?: string[];
        isPremium?: boolean;
        isActiveIn?: boolean[];
        sort?: "recent" | "popular" | "difficulty";
        after?: string; // cursor _id for pagination
        limit?: number;
    } = {}): Promise<IProblem[]> {
        const { sort = "recent", after, limit = 20 } = params;
        const filter = this.buildFilter(params);
        if (after && Types.ObjectId.isValid(after)) {
            (filter as any)._id = { $lt: new Types.ObjectId(after) }; // newest-first
        }

        const sortMap: Record<string, any> = {
            recent: { createdAt: -1 },
            popular: { totalSubmissions: -1, totalAccepted: -1 },
            difficulty: { difficulty: 1, createdAt: -1 },
        };

        return await Problem.find(filter)
            .sort(sortMap[sort] || sortMap.recent)
            .limit(Math.min(Math.max(limit, 1), 100));
    }

    // GET /problems/count
    async countProblems(params: {
        q?: string;
        slug?: string;
        difficultyIn?: ("Easy" | "Medium" | "Hard")[];
        tagsIn?: string[];
        companyIn?: string[];
        isPremium?: boolean;
        isActiveIn?: boolean[];
    } = {}): Promise<number> {
        const filter = this.buildFilter(params);
        return await Problem.countDocuments(filter);
    }

    async getById(id: string): Promise<IProblem | null> {
        return await Problem.findById(id);
    }

    async getBySlug(slug: string): Promise<IProblem | null> {
        return await Problem.findOne({ slug: slug.toLowerCase() });
    }

    async updateById(id: string, data: Partial<IProblem>): Promise<IProblem | null> {
        return await this.update(id, data as any);
    }

    async softDeleteById(id: string): Promise<IProblem | null> {
        return await this.update(id, { isActive: false });
    }

    async getTags(id: string): Promise<string[]> {
        const doc = await Problem.findById(id).select("tags");
        return doc?.tags || [];
    }

    async addTags(id: string, tags: string[]): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $addToSet: { tags: { $each: tags } } },
            { new: true }
        );
    }

    async removeTag(id: string, tag: string): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $pull: { tags: tag } },
            { new: true }
        );
    }

    async getCompanies(id: string): Promise<Types.ObjectId[]> {
        const doc = await Problem.findById(id).select("companies");
        return doc?.companies || [];
    }

    async addCompanies(id: string, companies: string[]): Promise<IProblem | null> {
        const companyIds = companies.map((c) => new Types.ObjectId(c));
        return await Problem.findByIdAndUpdate(
            id,
            { $addToSet: { companies: { $each: companyIds } } },
            { new: true }
        );
    }

    async removeCompany(id: string, company: string): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $pull: { companies: new Types.ObjectId(company) } },
            { new: true }
        );
    }

    async getMeta(id: string): Promise<{
        difficulty: IProblem['difficulty'];
        tags: string[];
        companies?: Types.ObjectId[];
        slug: string;
        isActive?: boolean;
        isPremium?: boolean;
    } | null> {
        const doc = await Problem.findById(id).select("difficulty tags companies slug isActive isPremium");
        const { difficulty, tags, companies, slug, isActive, isPremium } = doc?.toObject() || {};
        return {
            difficulty: difficulty as IProblem['difficulty'],
            tags: tags as string[],
            companies: companies as Types.ObjectId[],
            slug: slug as string,
            isActive: isActive as boolean,
            isPremium: isPremium as boolean
        };
    }

    async getStats(id: string): Promise<{
        acceptanceRate?: number;
        totalSubmissions?: number;
        totalAccepted?: number;
    } | null> {
        const doc = await Problem.findById(id).select("acceptanceRate totalSubmissions totalAccepted");
        const { acceptanceRate, totalSubmissions, totalAccepted } = doc?.toObject() || {};
        return {
            acceptanceRate: acceptanceRate as number,
            totalSubmissions: totalSubmissions as number,
            totalAccepted: totalAccepted as number
        };
    }

    async listTestcases(id: string): Promise<{
        input: string;
        output: string;
    }[]> {
        const doc = await Problem.findById(id).select("testcases");
        return (doc?.toObject().testcases as any) || [];
    }

    async addTestcase(id: string, testcase: { input: string; output: string }): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $push: { testcases: testcase } },
            { new: true, runValidators: true }
        );
    }

    async updateTestcaseByIndex(id: string, index: number, patch: { input?: string; output?: string }): Promise<IProblem | null> {
        const set: any = {};
        if (patch.input !== undefined) {
            set[`testcases.${index}.input`] = patch.input;
        }
        if (patch.output !== undefined) {
            set[`testcases.${index}.output`] = patch.output;
        }
        return await Problem.findByIdAndUpdate(
            id,
            { $set: set },
            { new: true, runValidators: true }
        );
    }

    async deleteTestcaseByIndex(id: string, index: number): Promise<IProblem | null> {
        const doc = await Problem.findById(id).select("testcases");
        if (!doc) return null;

        const tcs = (doc.toObject().testcases as any[]) || [];
        if (index < 0 || index >= tcs.length) return doc;
        tcs.splice(index, 1);

        return await Problem.findByIdAndUpdate(
            id,
            { $set: { testcases: tcs } },
            { new: true, runValidators: true }
        );
    }

    async validateTestcases(problemId: string): Promise<{ valid: boolean; issues: string[]; count: number; }> {
        const tcs = await this.listTestcases(problemId);
        const issues: string[] = [];
        for (let i = 0; i < tcs.length; i++) {
            const tc = tcs[i];
            if (!tc.input?.trim()) issues.push(`testcase[${i}]: empty input`);
            if (!tc.output?.trim()) issues.push(`testcase[${i}]: empty output`);
        }
        // duplicate detection (input+output pair)
        const seen = new Set<string>();
        tcs.forEach((tc, i) => {
            const key = `${tc.input}::${tc.output}`;
            if (seen.has(key)) issues.push(`duplicate pair at index ${i}`);
            seen.add(key);
        });
        return { valid: issues.length === 0, issues, count: tcs.length };
    }

    async isSlugAvailable(slug: string): Promise<boolean> {
        const exists = await Problem.findOne({ slug: slug.toLowerCase() });
        return !exists;
    }

    // Statement
    async getStatement(id: string): Promise<Pick<IProblem, "title" | "description" | "constraints" | "hints" | "editorials"> | null> {
        const doc = await Problem.findById(id).select("title description constraints hints editorials");
        if (!doc) return null;
        const { title, description, constraints, hints, editorials } = doc.toObject();
        return { title, description, constraints, hints, editorials } as any;
    }

    async updateStatement(id: string, statement: Partial<Pick<IProblem, "title" | "description" | "constraints" | "hints" | "editorials">>): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $set: statement },
            { new: true, runValidators: true }
        );
    }

    // Random
    async findRandom(params: {
        difficultyIn?: ("Easy" | "Medium" | "Hard")[];
        tagsIn?: string[];
        companyIn?: string[];
        isPremium?: boolean;
        isActiveIn?: boolean[];
    } = {}): Promise<IProblem | null> {
        const match = this.buildFilter(params);
        const pipeline: PipelineStage[] = [
            { $match: match },
            { $sample: { size: 1 } },
        ];
        const docs = await Problem.aggregate(pipeline as any);
        return docs?.[0] ? await Problem.findById(docs[0]._id) : null;
    }
}