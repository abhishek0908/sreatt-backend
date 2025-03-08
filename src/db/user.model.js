import mongoose from 'mongoose';
import { UserRoles, UserStatus } from '../utils/constants.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4, 
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address']
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        required: true
    },
    password: { type: String, required: true },
    isDistributor: {
        type: Boolean,
        default: false
    },
    distributorStatus: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.PENDING
    }
}, { timestamps: true });



UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            if (!this.password) {
                throw new Error('Password is required');
            }
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

export default mongoose.model('User', UserSchema);
