// routes/index.js
import express from 'express'
const router = express.Router();
// Import route files
import userRoutes from './user.routes.js'
import { healthCheck } from '../controllers/testing.controller.js';
import { verifyUserMiddleware } from '../middleware/user.middleware.js';
import productRoutes from './product.routes.js'
import distributorRoutes from './distributor.routes.js'

// Use imported routes
router.use('/user', userRoutes); // Route for user-related operations
router.use('/product', productRoutes); // Uncomment this when adding product routes
router.get('/health',verifyUserMiddleware,healthCheck)
router.use('/distributor',distributorRoutes)

export default router;
