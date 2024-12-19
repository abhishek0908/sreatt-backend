import mongoose from 'mongoose';
import { UserStatus } from '../utils/constants.js';
// Define the Schema with the required fields
const DistributorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, // Ensures first name is provided
    },
    lastName: {
        type: String,
        required: true, // Ensures last name is provided
    },
    email: {
        type: String,
        required: true, // Ensures email is provided
        unique: true, // Ensures the email is unique
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address'], // Basic email validation
    },
    phoneNumber: {
        type: String,
        required: true, // Ensures phone number is provided
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'], // Valid phone number regex
    },
    address: {
        type: String,
        required: true, // Ensures address is provided
    },
    distributorStatus: {
        type: String,
        enum: Object.values(UserStatus), // Using UserStatus enum here
        default: UserStatus.PENDING // Default to 'pending', waiting for admin action
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Export the model based on the schema
export default mongoose.model('Distributor', DistributorSchema);
