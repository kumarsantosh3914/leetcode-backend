export type LeaderboardType = 'global' | 'easy' | 'medium' | 'hard';
export type LeaderboardPeriod = 'all-time' | 'monthly' | 'weekly' | 'daily';

export interface LeaderboardEntry {
    userId: string;
    score: number;
    rank: number;
    change?: string;
}

export interface UserRankContext {
    userRank: number | null;
    userScore: number;
    totalUsers: number;
    nearbyUsers: LeaderboardEntry[];
}