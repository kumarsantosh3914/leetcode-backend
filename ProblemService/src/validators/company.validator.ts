import { z } from "zod";

export const companySchema = z.object({
    name: z.string().min(1),
    logoUrl: z.string().min(1),
})