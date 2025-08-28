import { Job, Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../apis/submission.api";

function matchTestCasesWithResults(testCases: TestCase[], results: EvaluationResult[]) {
    const output: Record<string, string> = {};
    if(results.length !== testCases.length) {
        console.log("WA");
        return;
    }

    testCases.map((testCases, index) => {
        let retval = "";
        if(results[index].status === "time_limit_exceeded") {
            retval = "TLE";
        } else if (results[index].status === "failed") {
            retval = "Error";
        } else {
            // Match the output with the test case output
            if(results[index].output === testCases.output) {
                retval = "AC";
            } else {
                retval = "WA";
            }
        }

        console.log("retval", retval);
        output[testCases._id] = retval;
    });

    return output;
}

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job: Job) => {
        logger.info(`Processing job ${job.id}`);
        const data: EvaluationJob = job.data;

        console.log("data", data);
        console.log("data.problem.testcases", data.problem.testcases);

        try {
            const testCasesRunnerPromise = data.problem.testcases.map(testcase => {
                
                return runCode({
                    code: data.code,
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    imageName: LANGUAGE_CONFIG[data.language].imageName,
                    input: testcase.input,
                });
            });

            const testCasesRunnerResults: EvaluationResult[] = await Promise.all(testCasesRunnerPromise);

            console.log("testCasesRunnerResults", testCasesRunnerResults);

            const output = matchTestCasesWithResults(data.problem.testcases, testCasesRunnerResults);

            console.log("output", output);

            await updateSubmission(data.submissionId, "completed", output || {});
        } catch (error) {
            logger.error(`Evaluation job failed: ${job}`, error);
            return;
        }
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