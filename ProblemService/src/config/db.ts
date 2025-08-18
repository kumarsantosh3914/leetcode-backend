import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export async function connectDB() {
    try {
        const mongoURI = serverConfig.MONGODB_URI;
        await mongoose.connect(mongoURI);
        logger.info("Connected to MongoDB successfully");
    } catch (error) {
        logger.error("Error connecting to the database:", error);
        process.exit(1);
    }
}