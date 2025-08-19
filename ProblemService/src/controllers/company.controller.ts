import { NextFunction, Request, Response } from "express";
import { companyByIdService, createCompanyService, deleteCompanyService, getAllCompaniesService, updateCompanyService } from "../services/company.service";

export async function createCompanyHandler(req: Request, res: Response, next: NextFunction) {
    const response = await createCompanyService(req.body);

    res.status(201).json({
        message: "Company create successfully",
        data: response,
        success: true,
    });
}

export async function getCompanyHandler(req: Request, res: Response, next: NextFunction) {
    const response = await companyByIdService(req.params.id);

    res.status(200).json({
        message: "Company fetched successfully",
        data: response,
        success: true,
    });
}

export async function getAllCompaniesHandler(req: Request, res: Response, next: NextFunction) {
    const response = await getAllCompaniesService();

    res.status(200).json({
        message: "Company fetched successfully",
        data: response,
        success: true,
    });
}

export async function deleteCompanyHandler(req: Request, res: Response, next: NextFunction) {
    const response = await deleteCompanyService(req.params.id);

    res.status(200).json({
        message: "Company deleted successfully",
        data: response,
        success: true,
    });
}

export async function updateCompanyHandler(req: Request, res: Response, next: NextFunction) {
    const response = await updateCompanyService(req.params.id, req.body.data);

    res.status(200).json({
        message: "Company updated successfully",
        data: response,
        success: true,
    });
}