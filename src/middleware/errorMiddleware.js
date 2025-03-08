import { StatusCodes } from "http-status-codes";
import logger from "../logger.js";

export const errorHandler = (err, req, res, next) => {
    console.log("hello")

  logger.error(err.message);

  let statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  let response = {
    status: "error",
    message: err.message || "An unexpected error occurred",
    errors: [], // Ensuring it always contains { field, message }
  };

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    response.errors = err.errors.map((e) => ({
      field: e.path?.[0] || "unknown",
      message: e.message,
    }));
    statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle Mongoose validation errors
  else if (err.name === "ValidationError") {
    response.errors = Object.keys(err.errors).map((field) => ({
      field,
      message: err.errors[field].message,
    }));
    statusCode = StatusCodes.BAD_REQUEST;
  }
  // Ensure `errors` always contains at least one object
  if (response.errors.length === 0) {
    response.errors.push({ field: "general", message: response.message });
  }

  res.status(statusCode).json(response);
};
