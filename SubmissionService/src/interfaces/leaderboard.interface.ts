export type LeaderboardType = 'global' | 'easy' | 'medium' | 'hard';
export type LeaderboardPeriod = 'all-time' | 'monthly' | 'weekly' | 'daily';

// Difficulty used by Problem metadata and scoring logic
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

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