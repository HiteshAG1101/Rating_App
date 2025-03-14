const winston = require("winston");

// Custom log format with timestamp and level
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

// Application logger for general logs (info and above)
const appLogger = winston.createLogger({
    level: "info", // Log info and higher levels (info, error)
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to logs
        logFormat // Use custom format
    ),
    transports: [
        new winston.transports.File({ filename: "logs/app.log" }), // Save to app.log
        new winston.transports.Console(), // Also log to console
    ],
});

// Error logger for error-specific logs
const errorLogger = winston.createLogger({
    level: "error", // Only log errors
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [
        new winston.transports.File({ filename: "logs/error.log" }), // Save to error.log
        new winston.transports.Console(), // Also log to console
    ],
});

module.exports = { appLogger, errorLogger };