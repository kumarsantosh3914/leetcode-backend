import { Document } from "mongoose";

export interface ICompany extends Document {
    name?: string;
    logoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
