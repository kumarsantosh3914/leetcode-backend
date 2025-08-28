import axios from "axios";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";

export async function updateSubmission(submissionId: string, status: string, output: Record<string, string>) {
    try {
        console.log('output', output);
        const url = `${serverConfig.SUBMISSION_SERVICE}/submissions/${submissionId}/status`;

        logger.info(`Getting problem by ID`, { url });

        const response = await axios.patch(url, {
            status,
            submissionData: output,
        });

        if(response.status !== 200) {
            throw new InternalServerError("Failed to update submission status");
        }

        console.log("Submission updated successfully", response.data);
        return;
    } catch (error) {
        logger.error(`Error updating submission status:`, error);
        return null;
    }
}