import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { asyncLocalStorage } from "../utils/helpers/request.helpers";

export const attachCorrelationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Generate a new unique correlation ID
    const correlationId = uuidv4();

    // Store the correlation ID in the request object for later use
    req.headers['x-correlation-id'] = correlationId;

    // call the next middleware or route handler
    asyncLocalStorage.run({ correlationId: correlationId }, () => {
        next();
    })
}