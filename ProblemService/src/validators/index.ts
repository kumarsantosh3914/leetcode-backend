import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AnyZodObject } from 'zod';
import logger from '../config/logger.config';

/**
 * 
 * @param schema - zod schema to validate the request body
 * @returns - Middleware function to validte the request body
 */
export const validateRequestBody = (schema: AnyZodObject): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            logger.info('Validating request body...');
            await schema.parseAsync(req.body);
            logger.info('Request body is valid');
            next();
        } catch (error) {
            // If the validation faails, send a 400 response with the error message
            logger.error('Request body is invalid');
            return res.status(400).json({
                message: "Invalid request body",
                success: false,
                error: error
            });
        }
    }
}

/**
 * 
 * @param Schema - zod schema to validate the request query params
 * @returns - Middleware function to validate the request query params
 */
export const validteQueryParams = (Schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Schema.parseAsync(req.query);
            console.log('Query params are valid');
            next();
        } catch (error) {
            // If the validation fails, send a 400 response with the error message
            return res.status(400).json({
                message: "Invalid query params",
                success: false,
                error: error
            });
        }
    }
}