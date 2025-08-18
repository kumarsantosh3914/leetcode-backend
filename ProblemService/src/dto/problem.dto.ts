import { Types } from "mongoose";

export interface ICodeTemplateDTO {
    language: string;
    template: string;
    defaultCode?: string;
}

export interface createProblemDTO {
    problemNumber: number;
    title: string;
    slug: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    categoryId?: Types.ObjectId;
    isPremium?: boolean;
    isActive?: boolean;
    tags: string[];
    constraints: string[];
    codeTemplates: ICodeTemplateDTO[];
    hints?: string[];
    editorials?: string[];
    companies?: Types.ObjectId[];
    similarProblems?: Types.ObjectId[];
    followUp?: string[];
}