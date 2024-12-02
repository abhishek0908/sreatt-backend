// logger.js
import winston from 'winston';

// Create a custom log format
const logFormat = winston.format.combine(
  winston.format.colorize(),  // Colorize the log output for better visibility
  winston.format.timestamp(), // Add a timestamp for each log
  winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}` // Define the format of the log
  )
);

// Configure the logger
const logger = winston.createLogger({
  level: 'info',  // Default log level
  format: logFormat, // Use the log format defined above
  transports: [
    new winston.transports.Console(),  // Output logs to the console
  ],
});

export default logger;  // Export the logger so you can use it in other parts of the app
