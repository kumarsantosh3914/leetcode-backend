import { Document, Types } from "mongoose";

interface ICodeTemplate {
    language: string;
    template: string;
    defaultCode?: string;
}

export interface IProblem extends Document {
    problemNumber: number;
    title: string;
    slug: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    acceptanceRate?: number;
    totalSubmissions?: number;
    totalAccepted?: number;
    categoryId?: Types.ObjectId;
    isPremium?: boolean;
    isActive?: boolean;
    tags: string[];
    constraints: string[];
    codeTemplates: ICodeTemplate[];
    hints?: any[];
    editorials?: any[];
    companies?: Types.ObjectId[];
    similarProblems?: Types.ObjectId[];
    followUp?: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy?: Types.ObjectId;
}
