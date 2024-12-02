import mongoose from 'mongoose';
import { UserRoles } from '../utils/constants.js';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Add unique constraint
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true // Add unique constraint
    },
    role: {
        type: String,
        enum: Object.values(UserRoles), // Use the values from the enum
        required: true // Optional: Make it required if every user must have a role
    }
});

export default mongoose.model('User', UserSchema);
