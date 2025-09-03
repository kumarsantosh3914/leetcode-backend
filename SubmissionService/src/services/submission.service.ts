import { getProblemById } from "../apis/problem.api";
import logger from "../config/logger.config";
import { ISubmission, ISubmissionData, SubmissionStatus } from "../models/submission";
import { addSubmissionJob } from "../producers/submission.producer";
import { ISubmissionRepository } from "../repositories/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { LeaderboardService } from "./leaderboard.service";
import { createNewRedisConnection } from "../config/redis.config";

export interface ISubmissionService {
  createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission>;
  getSubmissionById(id: string): Promise<ISubmission | null>;
  getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
  deleteSubmission(id: string): Promise<boolean>;
  updateSubmissionStatus(
    id: string,
    status: SubmissionStatus,
    submissionData: ISubmissionData
  ): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {
  private submissionRepository: ISubmissionRepository;
  private leaderboardService: LeaderboardService;

  constructor(submissionRepository: ISubmissionRepository) {
    this.submissionRepository = submissionRepository;
    this.leaderboardService = new LeaderboardService(createNewRedisConnection());
  }

  async createSubmission(
    submissionData: Partial<ISubmission>
  ): Promise<ISubmission> {
    // check if the problem exists
    if (!submissionData.problemId) {
      throw new BadRequestError("Problem ID is required");
    }

    if (!submissionData.code) {
      throw new BadRequestError("Code is required");
    }

    if (!submissionData.language) {
      throw new BadRequestError("Language is required");
    }

    if (!submissionData.userId) {
      throw new BadRequestError("User ID is required");
    }

    const problem = await getProblemById(submissionData.problemId);
    if (!problem) {
      throw new NotFoundError("Problem not found or something went wrong");
    }

    const submission = await this.submissionRepository.create(submissionData);

    // submission to redis queue
    const jobId = await addSubmissionJob({
      submissionId: submission.id,
      problem,
      code: submissionData.code,
      language: submissionData.language,
    });

    logger.info(`Submission job added: ${jobId}`);

    return submission;
  }

  async getSubmissionById(id: string): Promise<ISubmission | null> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError("Submission not found");
    }

    return submission;
  }

  async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
    const submissions = await this.submissionRepository.findByProblemId(
      problemId
    );
    return submissions;
  }

  async deleteSubmission(id: string): Promise<boolean> {
    const result = await this.submissionRepository.deleteById(id);
    if (!result) {
      throw new NotFoundError("Submission not found");
    }

    return result;
  }

  async updateSubmissionStatus(
    id: string,
    status: SubmissionStatus,
    submissionData: ISubmissionData,
  ): Promise<ISubmission | null> {
    const submission = await this.submissionRepository.updateStatus(id, status, submissionData);
    if (!submission) {
      throw new NotFoundError("Submission not found");
    }

    // If completed and all testcases are AC, increment leaderboard based on difficulty
    try {
      if (status === SubmissionStatus.COMPLETED) {
        const values = Object.values(submissionData || {} as ISubmissionData);
        const allAC = values.length > 0 && values.every((verdict) => verdict === 'AC');
        if (allAC) {
          const problem = await getProblemById(submission.problemId);
          if (problem && (problem.difficulty === 'Easy' || problem.difficulty === 'Medium' || problem.difficulty === 'Hard')) {
            await this.leaderboardService.incrementUserScore(submission.userId, problem.difficulty);
            logger.info('Leaderboard incremented', { userId: submission.userId, difficulty: problem.difficulty });
          }
        }
      }
    } catch (err) {
      logger.error('Failed to update leaderboard for submission', { submissionId: id, err });
    }

    return submission;
  }
}
