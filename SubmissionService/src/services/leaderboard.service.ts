import { Redis } from 'ioredis';
import { createNewRedisConnection } from '../config/redis.config';
import { LEADERBOARD_CONFIG } from '../config/leaderboard.config';
import { Difficulty, LeaderboardEntry, LeaderboardType } from '../interfaces/leaderboard.interface';

export interface ILeaderboardService {
	incrementUserScore(userId: string, difficulty: Difficulty): Promise<void>;
	getLeaderboard(type: LeaderboardType, limit?: number): Promise<LeaderboardEntry[]>;
}

export class LeaderboardService implements ILeaderboardService {
	private redis: Redis;

	constructor(redisClient?: Redis) {
		this.redis = redisClient || createNewRedisConnection();
	}

	async incrementUserScore(userId: string, difficulty: Difficulty): Promise<void> {
		const points = LEADERBOARD_CONFIG.DIFFICULTY_POINTS[difficulty];
		const member = `user:${userId}`;

		await this.redis.pipeline()
			.zincrby('leaderboard:global:all-time', points, member)
			.zincrby(`leaderboard:${difficulty.toLowerCase()}:all-time`, points, member)
			.exec();
	}

	async getLeaderboard(type: LeaderboardType, limit: number = 100): Promise<LeaderboardEntry[]> {
		const key = this.resolveAllTimeKey(type);
		const withScores = await this.redis.zrevrange(key, 0, Math.max(0, limit - 1), 'WITHSCORES');
		return this.formatWithRanks(withScores);
	}

	private resolveAllTimeKey(type: LeaderboardType): string {
		if (type === 'global') return 'leaderboard:global:all-time';
		return `leaderboard:${type}:all-time`;
	}

	private formatWithRanks(zrangeWithScores: string[]): LeaderboardEntry[] {
		const entries: LeaderboardEntry[] = [];
		for (let i = 0, rank = 1; i < zrangeWithScores.length; i += 2, rank += 1) {
			const member = zrangeWithScores[i];
			const scoreStr = zrangeWithScores[i + 1];
			entries.push({
				userId: member.replace(/^user:/, ''),
				score: Number(scoreStr) || 0,
				rank,
			});
		}
		return entries;
	}
}
