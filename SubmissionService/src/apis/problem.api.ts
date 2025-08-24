import axios, { AxiosResponse } from "axios";
import { serverConfig } from "../config";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial: string;
    testcases: ITestcase[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProblemResponse {
    data: IProblemDetails;
    message: string;
    success: boolean;
}

export async function getProblemById(problemId: string): Promise<IProblemDetails | null> {
    try {
        const response: AxiosResponse<IProblemResponse> = 
         await axios.get(`${serverConfig.PROBLEM_SERVICE}/problems/${problemId}`);

        if (response.data.success) {
            return response.data.data;
        }

        throw new InternalServerError('Failed to fetch problem details');
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.error(`Axios error while fetching problem details: ${error.message}`, {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            logger.error(`Unexpected error while fetching problem details: ${error}`);
        }
        return null;
    }
}