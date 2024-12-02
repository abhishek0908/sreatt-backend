import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { z } from 'zod';
import { UserRoles } from '../utils/constants.js';
import User from '../db/user.model.js';
import logger from '../logger.js';
import StatusCodes from '../utils/statusCodes.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const SECRET_KEY = process.env.SECRET_KEY
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}

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
    const validatedData = signUpSchema.parse(req.body);
    const { first_name, last_name, email, password, phoneNumber, role } = validatedData;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      logger.warn(`Email ${email} is already registered.`);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Email is already in use" });
    }

    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      logger.warn(`Phone number ${phoneNumber} is already registered.`);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Phone number is already in use" });
    }

    const user = new User({
      first_name,
      last_name,
      email,
      password,
      phoneNumber,
      role
    });

    await user.save();
    logger.info(`New user signed up: ${email}`);
    res.status(StatusCodes.CREATED).json({ message: "User signed up successfully" });

  } catch (error) {
    logger.error(error.message);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors || "Validation failed" });
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
    const token = jwt.sign(email,SECRET_KEY);
    console.log(token)
    res.status(StatusCodes.OK).json({ token: token })
  }
  catch (error) {
    logger.error(error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error })
  }

}