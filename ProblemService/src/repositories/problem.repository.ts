import { Types } from "mongoose";
import Problem from "../models/problem";
import { IProblem } from "../types/problem.types";
import BaseRepository from "./base.repository";

export class ProblemRepository extends BaseRepository<IProblem> {
    constructor() {
        super(Problem);
    }

    async getById(id: string): Promise<IProblem | null> {
        return await Problem.findById(id);
    }

    async getBySlug(slug: string): Promise<IProblem | null> {
        return await Problem.findOne({ slug : slug.toLowerCase()});
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

    async getAllCompaniesHandler(id: string): Promise<Types.ObjectId[]> {
        const doc = await Problem.findById(id).select("companies");
        return doc?.companies || [];
    }

    async getCompanies(id: string): Promise<Types.ObjectId[]> {
        const doc = await Problem.findById(id).select("companies");
        return doc?.companies || [];
    }

    async addCompanies(id: string, companies: string[]): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $addToSet: { companies: { $each: companies } } },
            { new: true }
        );
    }

    async removeCompany(id: string, company: string): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(
            id,
            { $pull: { companies: company } },
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
        const doc = await Problem.findById(id).select("difficulty tags companies isActive isPremium");
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
            { $addToSet: { testcases: testcase } },
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
        tcs.slice(index, 1);

        return await Problem.findByIdAndUpdate(
            id,
            { $set: { testcases: tcs } },
            { new: true, runValidators: true }
        );
    }

    async validateTestcases(problemId: string): Promise<{ valid: boolean; issues: string[]; count: number; }>{
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
}