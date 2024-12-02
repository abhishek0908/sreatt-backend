// routes/user.routes.js
import express from 'express';
const router = express.Router();
import { addProduct, deleteProduct } from '../controllers/product.controllers.js';
import { verifyUserMiddleware } from '../middleware/user.middleware.js';

// Define the routes and associate them with controller functions
router.post('/addProduct', verifyUserMiddleware, addProduct); // Now Multer is handled in the controller
router.delete('/deleteProduct/:productId', verifyUserMiddleware, deleteProduct); // Now Multer is handled in the controller

export default router;
