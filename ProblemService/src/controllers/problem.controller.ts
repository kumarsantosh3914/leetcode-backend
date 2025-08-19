import { NextFunction, Request, Response } from "express";
import { createProblemService, deleteProblemService, getAllProblemsService, getProblemByIdService, updateProblemService } from "../services/problem.service";

export async function createProblemHandler(req: Request, res: Response, next: NextFunction) {
    const response = await createProblemService(req.body);

    res.status(201).json({
        message: "Problem created successfully",
        data: response,
        success: true,
    })
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
    })
}