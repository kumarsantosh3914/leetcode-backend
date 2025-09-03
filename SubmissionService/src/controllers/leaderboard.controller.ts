import { RequestHandler } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';

export class LeaderboardController {
	private leaderboardService: LeaderboardService;

	constructor(leaderboardService: LeaderboardService) {
		this.leaderboardService = leaderboardService;
	}

	getLeaderboard: RequestHandler = async (req, res) => {
		try {
			const { type } = req.params as { type: 'global' | 'easy' | 'medium' | 'hard' };
			const limit = Number(req.query.limit) || 100;

			if (!['global', 'easy', 'medium', 'hard'].includes(type)) {
				res.status(400).json({ success: false, error: 'Invalid leaderboard type' });
				return;
			}

			const data = await this.leaderboardService.getLeaderboard(type, limit);
			res.status(200).json({ success: true, data });
		} catch (error) {
			res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
		}
	};
}
