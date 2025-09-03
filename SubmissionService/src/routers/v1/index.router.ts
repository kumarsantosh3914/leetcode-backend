import express from 'express';
import pingRouter from './ping.router';
import submissionRouter from './submission.router';
import leaderboardRouter from './leaderboard.router';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/submissions', submissionRouter)
v1Router.use('/leaderboard', leaderboardRouter)

export default v1Router;