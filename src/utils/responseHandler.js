import { StatusCodes } from "http-status-codes";

export const sendResponse = (res, status, message, data = null, errors = null) => {
  return res.status(status).json({
    status: status < 400 ? "success" : "error",
    message,
    data,
    errors,
  });
};
