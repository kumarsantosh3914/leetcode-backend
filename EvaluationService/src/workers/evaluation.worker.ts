import { Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job) => {
        logger.info(`Processing job ${job.id}`);
    }, {
        connection: createNewRedisConnection(),
    });

    worker.on("error", (error) => {
        logger.error(`Evaluation worker error: ${error}`);
    });

    worker.on("completed", (job) => {
        logger.info(`Evaluation job completed: ${job}`);
    });

    worker.on("failed", (job, err) => {
        logger.error(`Evaluation job failed: ${job}, error: ${err}`);
    });

    return worker;
}

export default async function initEvaluationWorker() {
    await setupEvaluationWorker();
}