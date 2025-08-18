import { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "../services/category.service";

export async function createCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const resposne = await createCategoryService(req.body);

  res.status(201).json({
    message: "Category create successfully",
    data: resposne,
    success: true,
  });
}

export async function getCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const response = await getCategoryByIdService(req.params.id);

  res.status(200).json({
    message: "Category fetched successfully",
    data: response,
    success: true,
  });
}

export async function getAllCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const response = await getAllCategoriesService();

  res.status(200).json({
    message: "Categories fetched successfully",
    data: response,
    success: true,
  });
}

export async function deleteCategoryHandler(req: Request, res: Response, next: NextFunction) {
    const response = await deleteCategoryService(req.params.id);

    res.status(200).json({
        message: "Category deleted successfully",
        data: response,
        success: true,
    });
}

export async function updateCategoryHandler(req: Request, res: Response, next: NextFunction) {
    const response = await updateCategoryService(req.params.id, req.body);

    res.status(200).json({
        message: "Category updated successfully",
        data: response,
        success: true,
    });
}