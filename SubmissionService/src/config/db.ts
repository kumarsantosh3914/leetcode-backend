import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export async function connectDB() {
    try {
        const DB_URI = serverConfig.DB_URI;
        await mongoose.connect(DB_URI);
        logger.info("Connected to MongoDB successfully");
    } catch (error) {
        logger.error("Error connecting to the database:", error);
        process.exit(1);
    }
}