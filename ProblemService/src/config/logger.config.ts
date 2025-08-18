import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { getCorrelationId } from "../utils/helpers/request.helpers";
import "winston-mongodb"
import { serverConfig } from ".";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        winston.format.json(),
        // define a cutom print
        winston.format.printf( ({  level, message, timestamp, ...data }) => {
            const output = { 
                level,
                message, 
                timestamp, 
                correlationId: getCorrelationId(), 
                data 
            };
            return JSON.stringify(output);
        })
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: "logs/%DATE%-app.log", // The file name pattern
            datePattern: "YYYY-MM-DD", // The date format
            maxSize: "20m", // The maximum size of the log file
            maxFiles: "14d", // The maximum number of log files to keep
        }),
        new winston.transports.MongoDB({
            db: serverConfig.MONGODB_URI,
            collection: 'app_logs',
            format: winston.format.json()
        })
    ],
});

export default logger;