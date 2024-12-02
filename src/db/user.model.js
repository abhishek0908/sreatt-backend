import mongoose from 'mongoose';
import { UserRoles, UserStatus } from '../utils/constants.js'; // Assuming you want to store statuses in constants.js
import bcrypt from 'bcrypt';

// Define the User Schema with necessary fields and validations
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure the email is unique
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address'] // Basic email format validation
    },
    first_name: {
        type: String,
        required: true // Ensure the first name is provided
    },
    last_name: {
        type: String,
        required: true // Ensure the last name is provided
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true, // Ensure the phone number is unique
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'] // Example regex for phone numbers, including optional "+" for international numbers
    },
    role: {
        type: String,
        enum: Object.values(UserRoles), // Use the enum values from UserRoles
        required: true // Ensure every user has a role
    },
    password: { type: String, required: true },
    isDistributor: {
        type: Boolean,
        default: false // Initially set to false, will be updated once confirmed by admin
    },
    distributorStatus: {
        type: String,
        enum: Object.values(UserStatus), // Using UserStatus enum here
        default: UserStatus.PENDING // Default to 'pending', waiting for admin action
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            // Check if password is not empty
            if (!this.password) {
                throw new Error('Password is required');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(this.password, 10); // 10 is the salt rounds
            this.password = hashedPassword; // Set the hashed password
            next(); // Proceed with the save operation
        } catch (error) {
            next(error); // Pass the error to the next middleware if hashing fails
        }
    } else {
        next(); // If the password is not modified, proceed with saving
    }
});

// Export the User model based on the schema
export default mongoose.model('User', UserSchema);
