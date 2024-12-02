import mongoose, { mongo } from "mongoose";

import { ProductCategories,ImageCount } from "../utils/constants.js";

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true // Trim spaces from product name
    },
    productDescription: {
        type: String,
        required: true,
        trim: true // Trim spaces from description
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive value'] // Ensure the price is non-negative
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(ProductCategories), // Enums for categories
        lowercase: true // Ensure the category is in lowercase
    },
    images: {
        type: [String], // Array to store multiple image URLs
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= ImageCount.MIN_IMAGES && v.length <= ImageCount.MAX_IMAGES; // Ensure images are within the defined range
            },
            message: `A product must have between ${ImageCount.MIN_IMAGES} to ${ImageCount.MAX_IMAGES} images`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export the Product model based on the schema
export default mongoose.model('Product', productSchema);
