// routes/user.routes.js
import express from 'express';
const router = express.Router();
import { addProduct, deleteProduct, getProduct } from '../controllers/product.controllers.js';
import { verifyUserMiddleware } from '../middleware/user.middleware.js';
import { checkAdminRole } from '../middleware/checkAdminRole.middleware.js';

router.post('/add-product', verifyUserMiddleware,checkAdminRole, addProduct);
router.delete('/delete-product/:productId', verifyUserMiddleware,checkAdminRole, deleteProduct); 
router.get('/products/:page', getProduct); 

export default router;
