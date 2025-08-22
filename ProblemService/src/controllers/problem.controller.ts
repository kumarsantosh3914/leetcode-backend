import { NextFunction, Request, Response } from "express";
import {
    createProblemService,
    deleteProblemService,
    getAllProblemsService,
    getProblemByIdService,
    updateProblemService,
    getBySlug,
    updateById,
    softDeleteById,
    getTags,
    addTags,
    removeTags,
    getAllCompanies,
    addCompanies,
    removeCompany,
    getMeta,
    getStats,
    listTestcases,
    addTestcase,
    updateTestcaseByIndex,
    deleteTestcaseByIndex,
    validateTestcases,
    isSlugAvailable,
    listProblemsService,
    countProblemsService,
    getStatementService,
    updateStatementService,
    findRandomProblemService,
} from "../services/problem.service";

export async function createProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await createProblemService(req.body);

    res.status(201).json({
        message: "Problem created successfully",
        data: response,
        success: true,
    });
}

export async function getProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await getProblemByIdService(req.params.id);

    res.status(200).json({
        message: "Problem fetched successfully",
        data: response,
        success: true,
    });
}

export async function getAllProblemsHandler(req: Request, res: Response, next: NextFunction) {
    const response = await getAllProblemsService();

    res.status(200).json({
        message: "Problem fetched successfully",
        data: response,
        success: true,
    });
}

export async function deleteProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await deleteProblemService(req.params.id);

    res.status(200).json({
        message: "Problem deleted successfully",
        data: response,
        success: true,
    });
}

export async function updateProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await updateProblemService(req.params.id, req.body);

    res.status(200).json({
        message: "Problem update successfully",
        data: response,
        success: true,
    });
}

export async function getProblemsHandler(req: Request, res: Response, next: NextFunction) {
    const q = (req.query.q as string) || undefined;
    const slug = (req.query.slug as string) || undefined;
    const difficultyIn = (req.query.difficultyIn as string | undefined)?.split(",").filter(Boolean) as any;
    const tagsIn = (req.query.tagsIn as string | undefined)?.split(",").filter(Boolean);
    const companyIn = (req.query.companyIn as string | undefined)?.split(",").filter(Boolean);
    const isPremium = typeof req.query.isPremium !== "undefined" ? req.query.isPremium === "true" : undefined;
    const isActiveIn = (req.query.isActiveIn as string | undefined)?.split(",").filter(Boolean).map(v => v === "true");
    const sort = (req.query.sort as "recent" | "popular" | "difficulty") || "recent";
    const after = (req.query.after as string) || undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const response = await listProblemsService({ q, slug, difficultyIn, tagsIn, companyIn, isPremium, isActiveIn, sort, after, limit } as any);
    res.status(200).json({ message: "Problems fetched", data: response, success: true });
}

export async function getProblemsCountHandler(req: Request, res: Response, next: NextFunction) {
    const q = (req.query.q as string) || undefined;
    const slug = (req.query.slug as string) || undefined;
    const difficultyIn = (req.query.difficultyIn as string | undefined)?.split(",").filter(Boolean) as any;
    const tagsIn = (req.query.tagsIn as string | undefined)?.split(",").filter(Boolean);
    const companyIn = (req.query.companyIn as string | undefined)?.split(",").filter(Boolean);
    const isPremium = typeof req.query.isPremium !== "undefined" ? req.query.isPremium === "true" : undefined;
    const isActiveIn = (req.query.isActiveIn as string | undefined)?.split(",").filter(Boolean).map(v => v === "true");

    const response = await countProblemsService({ q, slug, difficultyIn, tagsIn, companyIn, isPremium, isActiveIn } as any);
    res.status(200).json({ message: "Problems count fetched", data: response, success: true });
}

export async function getProblemBySlugHandler(req: Request, res: Response, next: NextFunction) {
    const response = await getBySlug(req.params.slug);
    res.status(200).json({ message: "Problem fetched by slug", data: response, success: true });
}

export async function patchProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await updateById(req.params.id, req.body);
    res.status(200).json({ message: "Problem updated successfully", data: response, success: true });
}

export async function softDeleteProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await softDeleteById(req.params.id);
    res.status(200).json({ message: "Problem soft-deleted", data: response, success: true });
}

export async function getProblemTagsHandler(req: Request, res: Response) {
    const response = await getTags(req.params.id);
    res.status(200).json({ message: "Tags fetched", data: response, success: true });
}
export async function addProblemTagsHandler(req: Request, res: Response) {
    const response = await addTags(req.params.id, req.body.tags || []);
    res.status(200).json({ message: "Tags added", data: response, success: true });
}
export async function removeProblemTagHandler(req: Request, res: Response) {
    const response = await removeTags(req.params.id, req.params.tag);
    res.status(200).json({ message: "Tag removed", data: response, success: true });
}

export async function getProblemCompaniesHandler(req: Request, res: Response) {
    const response = await getAllCompanies(req.params.id);
    res.status(200).json({ message: "Companies fetched", data: response, success: true });
}
export async function addProblemCompaniesHandler(req: Request, res: Response) {
    const response = await addCompanies(req.params.id, req.body.companies || []);
    res.status(200).json({ message: "Companies added", data: response, success: true });
}
export async function removeProblemCompanyHandler(req: Request, res: Response) {
    const response = await removeCompany(req.params.id, req.params.companyId);
    res.status(200).json({ message: "Company removed", data: response, success: true });
}

export async function getProblemStatementHandler(req: Request, res: Response) {
    const response = await getStatementService(req.params.id);
    res.status(200).json({ message: "Statement fetched", data: response, success: true });
}
export async function updateProblemStatementHandler(req: Request, res: Response) {
    const response = await updateStatementService(req.params.id, req.body || {});
    res.status(200).json({ message: "Statement updated", data: response, success: true });
}
export async function getProblemMetaHandler(req: Request, res: Response) {
    const response = await getMeta(req.params.id);
    res.status(200).json({ message: "Meta fetched", data: response, success: true });
}
export async function getProblemStatsHandler(req: Request, res: Response) {
    const response = await getStats(req.params.id);
    res.status(200).json({ message: "Stats fetched", data: response, success: true });
}

export async function getProblemTestcasesHandler(req: Request, res: Response) {
    const response = await listTestcases(req.params.id);
    res.status(200).json({ message: "Testcases fetched", data: response, success: true });
}
export async function addProblemTestcaseHandler(req: Request, res: Response) {
    const response = await addTestcase(req.params.id, req.body);
    res.status(200).json({ message: "Testcase added", data: response, success: true });
}
export async function updateProblemTestcaseHandler(req: Request, res: Response) {
    const index = parseInt(req.params.index, 10);
    const response = await updateTestcaseByIndex(req.params.id, index, req.body || {});
    res.status(200).json({ message: "Testcase updated", data: response, success: true });
}
export async function deleteProblemTestcaseHandler(req: Request, res: Response) {
    const index = parseInt(req.params.index, 10);
    const response = await deleteTestcaseByIndex(req.params.id, index);
    res.status(200).json({ message: "Testcase deleted", data: response, success: true });
}
export async function validateProblemTestcasesHandler(req: Request, res: Response) {
    const response = await validateTestcases(req.params.id);
    res.status(200).json({ message: "Testcases validated", data: response, success: true });
}

export async function getRandomProblemHandler(req: Request, res: Response) {
    const difficultyIn = (req.query.difficultyIn as string | undefined)?.split(",").filter(Boolean) as any;
    const tagsIn = (req.query.tagsIn as string | undefined)?.split(",").filter(Boolean);
    const companyIn = (req.query.companyIn as string | undefined)?.split(",").filter(Boolean);
    const isPremium = typeof req.query.isPremium !== "undefined" ? req.query.isPremium === "true" : undefined;
    const isActiveIn = (req.query.isActiveIn as string | undefined)?.split(",").filter(Boolean).map(v => v === "true");
    const response = await findRandomProblemService({ difficultyIn, tagsIn, companyIn, isPremium, isActiveIn } as any);
    res.status(200).json({ message: "Random problem fetched", data: response, success: true });
}

export async function isSlugAvailableHandler(req: Request, res: Response) {
    const response = await isSlugAvailable((req.query.slug as string) || "");
    res.status(200).json({ message: "Slug availability", data: { available: response }, success: true });
}