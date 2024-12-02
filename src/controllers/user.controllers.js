// controllers/userController.js
import mongoose from 'mongoose';
import { z } from 'zod';
import { UserRoles } from '../utils/constants.js';
import User from '../db/user.model.js';
// Define the Zod schema for validation
const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),  // First name must be a non-empty string
  last_name: z.string().min(1, "Last name is required"),    // Last name must be a non-empty string
  email: z.string().email("Invalid email format"),           // Email must be a valid email format
  password: z.string().min(6, "Password must be at least 6 characters long"), // Password must be at least 6 characters
  role: z.enum(Object.values(UserRoles), "Role is required") // Role must be one of the predefined values
});

export const SignUp = async (req, res) => {
  try {
    // Validate the request body using the Zod schema
    const validatedData = signUpSchema.parse(req.body); // Throws an error if validation fails
    
    // If the data is valid, you can proceed with further actions, like saving to the database
    const { first_name, last_name, email, password, role } = validatedData;
    const user = User({
      first_name,last_name,email,password,role
    })
    user.save()
    // Logic to save the user to the database (e.g., using Mongoose) goes here
    
    res.status(201).json({ message: "User signed up successfully" });

  } catch (error) {
    // If validation fails, send a 400 status with error details
    res.status(400).json({ error: error.errors || "Validation failed" });
  }
};
