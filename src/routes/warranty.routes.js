import express from 'express';
const router = express.Router();
import { getAllWarranties, registerWarranty,updateWarranty,viewWarranty } from '../controllers/warranty.controller.js';
import { verifyUserMiddleware } from '../middleware/user.middleware.js';
import { checkAdminRole } from '../middleware/checkAdminRole.middleware.js';
router.post('/register-warranty', registerWarranty);
router.get('/view-warranty',viewWarranty)
router.put('/update-warranty',verifyUserMiddleware,checkAdminRole,updateWarranty)
router.get('/get-all-warranty',verifyUserMiddleware,checkAdminRole,getAllWarranties)

export default router;
