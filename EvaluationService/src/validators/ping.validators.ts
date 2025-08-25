import { z } from 'zod';

/**
 * Zod schema for validating the request body of the ping endpoint.
 * The request body should contain a message property which is a non-empty string.
 */
export const pingSchema = z.object({
    message: z.string().min(1),
})