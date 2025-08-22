import { createProblemDTO } from "../dto/problem.dto";
import { ProblemRepository } from "../repositories/problem.repository";
import { BadRequestError } from "../utils/errors/app.error";
import { Types } from "mongoose";

const problemRepository = new ProblemRepository();

export async function createProblemService(problemDto: createProblemDTO) {
    // normalize slug and check uniqueness
    if ((problemDto as any).slug) {
        (problemDto as any).slug = (problemDto as any).slug.toLowerCase();
        const available = await problemRepository.isSlugAvailable((problemDto as any).slug);
        if (!available) {
            throw new BadRequestError("Slug already in use");
        }
    }
    const problem = await problemRepository.create(problemDto);
    return problem;
}

export async function getProblemByIdService(id: string) {
    const problem = await problemRepository.findById(id);
    return problem;
}

export async function getAllProblemsService() {
    const problems = await problemRepository.findAll();
    return problems;
}

export async function deleteProblemService(id: string) {
    const problem = await problemRepository.delete(id);
    return problem;
}

export async function updateProblemService(id: string, problemDto: createProblemDTO) {
    // normalize slug and check uniqueness if changed
    if ((problemDto as any).slug) {
        (problemDto as any).slug = (problemDto as any).slug.toLowerCase();
        const existing = await problemRepository.getBySlug((problemDto as any).slug);
        if (existing && String(existing._id) !== String(id)) {
            throw new BadRequestError("Slug already in use by another problem");
        }
    }
    const problem = await problemRepository.update(id, problemDto);
    return problem;
}

export async function getById(id: string) {
    return await problemRepository.getById(id);
}

export async function getBySlug(slug: string) {
    return await problemRepository.getBySlug(slug);
}

export async function updateById(id: string, data: createProblemDTO) {
    return await problemRepository.updateById(id, data);
}

export async function softDeleteById(id: string) {
    return await problemRepository.softDeleteById(id);
}

export async function getTags(id: string) {
    return await problemRepository.getTags(id);
}

export async function addTags(id: string, tags: string[]) {
    return await problemRepository.addTags(id, tags);
}

export async function removeTags(id: string, tag: string) {
    return await problemRepository.removeTag(id, tag);
}

export async function getAllCompanies(id: string) {
    return await problemRepository.getCompanies(id);
}

export async function addCompanies(id: string, companies: string[]) {
    // optional: validate ObjectId format early
    const invalid = companies.find((c) => !Types.ObjectId.isValid(c));
    if (invalid) throw new BadRequestError(`Invalid company id: ${invalid}`);
    return await problemRepository.addCompanies(id, companies);
}

export async function removeCompany(id: string, company: string) {
    if (!Types.ObjectId.isValid(company)) throw new BadRequestError("Invalid company id");
    return await problemRepository.removeCompany(id, company);
}

export async function getMeta(id: string) {
    return await problemRepository.getMeta(id);
}

export async function getStats(id: string) {
    return await problemRepository.getStats(id);
}

export async function listTestcases(id: string) {
    return await problemRepository.listTestcases(id);
}

export async function addTestcase(id: string, testcase: { input: string; output: string }) {
    return await problemRepository.addTestcase(id, testcase);
}

export async function updateTestcaseByIndex(id: string, index: number, patch: { input?: string; output?: string }) {
    return await problemRepository.updateTestcaseByIndex(id, index, patch);
}

export async function deleteTestcaseByIndex(id: string, index: number) {
    return await problemRepository.deleteTestcaseByIndex(id, index);
}

export async function validateTestcases(problemId: string) {
    return await problemRepository.validateTestcases(problemId);
}

export async function isSlugAvailable(slug: string) {
    return await problemRepository.isSlugAvailable(slug);
}

// New service wrappers for list, count, statement, random
export async function listProblemsService(params: {
    q?: string;
    slug?: string;
    difficultyIn?: ("Easy" | "Medium" | "Hard")[];
    tagsIn?: string[];
    companyIn?: string[];
    isPremium?: boolean;
    isActiveIn?: boolean[];
    sort?: "recent" | "popular" | "difficulty";
    after?: string;
    limit?: number;
} = {}) {
    return await problemRepository.listProblems(params);
}

export async function countProblemsService(params: {
    q?: string;
    slug?: string;
    difficultyIn?: ("Easy" | "Medium" | "Hard")[];
    tagsIn?: string[];
    companyIn?: string[];
    isPremium?: boolean;
    isActiveIn?: boolean[];
} = {}) {
    return await problemRepository.countProblems(params);
}

export async function getStatementService(id: string) {
    return await problemRepository.getStatement(id);
}

export async function updateStatementService(id: string, statement: Partial<Pick<any, "title" | "description" | "constraints" | "hints" | "editorials">>) {
    return await problemRepository.updateStatement(id, statement as any);
}

export async function findRandomProblemService(params: {
    difficultyIn?: ("Easy" | "Medium" | "Hard")[];
    tagsIn?: string[];
    companyIn?: string[];
    isPremium?: boolean;
    isActiveIn?: boolean[];
} = {}) {
    return await problemRepository.findRandom(params);
}
