import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { z } from 'zod';
import { UserRoles, UserStatus } from '../utils/constants.js';
import User from '../db/user.model.js';
import logger from '../logger.js';
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const SECRET_KEY = process.env.SECRET_KEY
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}

// Define Zod schema
const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.enum(Object.values(UserRoles), "Role is required")
});

export const SignUp = async (req, res) => {
  try {
    // Step 1: Validate the incoming request data using Zod schema
    const validatedData = signUpSchema.parse(req.body);
    const { first_name, last_name, email, password, phoneNumber, role } = validatedData;

    // Step 2: Check if the email is already registered
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      logger.warn(`Email ${email} is already registered.`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Validation failed",
        details: [{ field: "email", message: "Email is already in use" }]
      });
    }

    // Step 3: Check if the phone number is already registered
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      logger.warn(`Phone number ${phoneNumber} is already registered.`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Validation failed",
        details: [{ field: "phoneNumber", message: "Phone number is already in use" }]
      });
    }

    // Step 4: Create a new user if the email and phone are unique
    const user = new User({
      first_name,
      last_name,
      email,
      password,
      phoneNumber,
      role
    });

    // Save the user to the database
    await user.save();
    logger.info(`New user signed up: ${email}`);

    // Step 5: Respond with success message
    res.status(StatusCodes.CREATED).json({ message: "User signed up successfully" });

  } catch (error) {
    // Step 6: Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path[0],
        message: err.message
      }));
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Validation failed",
        details: formattedErrors
      });
    }

    // Step 7: Handle unexpected errors
    logger.error("Unexpected error during signup:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An unexpected error occurred. Please try again later."
    });
  }
};
export const SignIn = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "Email Not Exists"
      })
    }
    console.log(user)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Invalid password"
      });
    } 
    const payload = {
      email: user.email,  // Only include email for identification
    };
    const token = jwt.sign(payload,SECRET_KEY);
    console.log(token)
    res.status(StatusCodes.OK).json({ role: user.role,token: token })
  }
  catch (error) {
    logger.error(error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ role: user.role,error: error })
  }

}

