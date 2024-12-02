// routes/index.js
import express from 'express'
const router = express.Router();

// Import route files
import userRoutes from './user.routes.js'

// Use imported routes
router.use('/user', userRoutes); // Route for user-related operations
// router.use('/product', productRoutes); // Uncomment this when adding product routes

export default router;
