export const LEADERBOARD_CONFIG = {
    DIFFICULTY_POINTS: {
        Easy: 10,
        Medium: 20,
        Hard: 30,
    },

    TIME_BOUND: {
        within_1_min: 5,
        within_5_min: 3,
        within_15_min: 1,
    },

    CACHE_TTL: {
        LEADERBOARD: 300, // 5 minutes
        USER_STATS: 600, // 10 minutes
        USER_RANK: 180, // 3 minutes
    }
};