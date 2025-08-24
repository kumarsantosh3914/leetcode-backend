import { IProblemDetails } from "../apis/problem.api";
import logger from "../config/logger.config";
import { SubmissionLanguage } from "../models/submission";
import { submissionQueue } from "../queues/submission.queue";

export interface ISubmissionJob {
    submissionId: string;
    problem: IProblemDetails;
    code: string;
    language: SubmissionLanguage;
}

export async function addSubmissionJob(data: ISubmissionJob): Promise<string | null> {
    try {
        const job = await submissionQueue.add("evaluate-submission", data);

        logger.info(`Submission job added: ${job.id}`);

        return job.id || null;
    } catch (error) {
        logger.error(`Error to add submission job: ${error}`);
        return null;
    }
}