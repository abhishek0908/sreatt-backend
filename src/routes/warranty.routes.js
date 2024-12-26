import express from 'express';
const router = express.Router();
import { registerWarranty,viewWarranty } from '../controllers/warranty.controller.js';
router.post('/register-warranty', registerWarranty);
router.get('/view-warranty',viewWarranty)

export default router;
