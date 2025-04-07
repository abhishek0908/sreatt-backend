import { z } from 'zod';
import { StatusCodes } from 'http-status-codes'; // For HTTP status codes
import Distributor from '../db/DistributorSchema.js';
import logger from '../logger.js';
// Define Zod schema for contact validation
const distributorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^\d+$/, "Phone number must contain only digits"), // Ensure phone number is numeric
  address: z.string().min(1, "Address is required")
});


export const applyDistributor = async (req, res) => {
  try {
    // Step 1: Validate the incoming request data using Zod schema
    const validatedData = distributorSchema.parse(req.body);
    const { firstName, lastName, email, phoneNumber, address } = validatedData;

    // Step 2: Check if the email is already registered (if needed)
    const emailExists = await Distributor.findOne({ email });
    if (emailExists) {
      logger.warn(`Email ${email} is already registered.`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Validation failed",
        details: [{ field: "email", message: "Email is already in use" }]
      });
    }

    // Step 3: Check if the phone number is already registered
    const phoneExists = await Distributor.findOne({ phoneNumber });
    if (phoneExists) {
      logger.warn(`Phone number ${phoneNumber} is already registered.`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Validation failed",
        details: [{ field: "phoneNumber", message: "Phone number is already in use" }]
      });
    }

    // Step 4: Create a new contact if the email and phone are unique
    const newContact = new Distributor({
      firstName,
      lastName,
      email,
      phoneNumber,
      address
    });

    // Step 5: Save the contact to the database
    await newContact.save();
    logger.info(`New contact created: ${email}`);

    // Step 6: Respond with success message
    res.status(StatusCodes.CREATED).json({ message: 'Contact created successfully', contact: newContact });

  } catch (error) {
    // Step 7: Handle Zod validation errors
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

    // Step 8: Handle unexpected errors
    logger.error("Unexpected error during contact creation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An unexpected error occurred. Please try again later."
    });
  }
};

export const getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find() 
    res.status(StatusCodes.OK).json({ distributors:distributors });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const updateDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;

    const { firstName, lastName, phoneNumber, distributorStatus, email } = req.body;

    // Build update object using camelCase to match schema
    const updates = {
      firstName,
      lastName,
      phoneNumber,
      distributorStatus,
    };

    if (email) {
      updates.email = email;
    }

    const distributor = await Distributor.findByIdAndUpdate(distributorId, updates, {
      new: true,
      runValidators: true,
    });

    if (!distributor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Distributor not found' });
    }

    res.status(StatusCodes.OK).json({ distributor });
  } catch (error) {
    console.error('Error updating distributor:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};