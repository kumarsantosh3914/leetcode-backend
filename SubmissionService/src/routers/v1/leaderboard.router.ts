import express from 'express';
import { LeaderboardFactory } from '../../factories/leaderboard.factory';

const leaderboardRouter = express.Router();
const leaderboardController = LeaderboardFactory.getLeaderboardController();

// GET /leaderboard/:type?limit=100
// type: global | easy | medium | hard
leaderboardRouter.get('/:type', leaderboardController.getLeaderboard);

export default leaderboardRouter;
