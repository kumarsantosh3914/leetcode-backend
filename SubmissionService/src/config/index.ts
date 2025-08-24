// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    DB_URI: string;
    REDIS_HOST: string; 
    REDIS_PORT: number;
    PROBLEM_SERVICE: string;
}

function loadEnv() {
    dotenv.config();
    console.log('Environment variables loaded from .env file');
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3000,
    DB_URI: String(process.env.DB_URI),
    REDIS_HOST: String(process.env.REDIS_HOST) || 'localhost',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    PROBLEM_SERVICE: String(process.env.PROBLEM_SERVICE) || 'http://localhost:3000/api/v1',
}