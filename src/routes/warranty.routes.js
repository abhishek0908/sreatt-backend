import express from 'express';
const router = express.Router();
import { registerWarranty,updateWarranty,viewWarranty } from '../controllers/warranty.controller.js';
router.post('/register-warranty', registerWarranty);
router.get('/view-warranty',viewWarranty)
router.put('/update-warranty',updateWarranty)
export default router;
