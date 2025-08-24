import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/app.error";

export const appErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log("Error: ", err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}

export const genericErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log("Error: ", err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}