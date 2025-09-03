import { LeaderboardController } from '../controllers/leaderboard.controller';
import { LeaderboardService } from '../services/leaderboard.service';
import { createNewRedisConnection } from '../config/redis.config';

export class LeaderboardFactory {
	private static leaderboardService: LeaderboardService;
	private static leaderboardController: LeaderboardController;

	static getLeaderboardService(): LeaderboardService {
		if (!this.leaderboardService) {
			this.leaderboardService = new LeaderboardService(createNewRedisConnection());
		}
		return this.leaderboardService;
	}

	static getLeaderboardController(): LeaderboardController {
		if (!this.leaderboardController) {
			this.leaderboardController = new LeaderboardController(this.getLeaderboardService());
		}
		return this.leaderboardController;
	}
}
