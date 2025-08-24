import Redis from 'ioredis';
import logger from './logger.config';


const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => {
        if(times >= 3) {
            return null;
        }

        return Math.min(times * 50, 2000); // Exponential backoff up to 2 seconds
    }
};

export const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => {
    logger.info("Connected to redis successfully");
})

redisClient.on('error', (err) => {
    logger.info("Redis connection error", err);
});

export const createNewRedisConnection = () => {
    return new Redis(redisConfig);
}