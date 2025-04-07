// routes/user.routes.js
import express from 'express';
import { applyDistributor } from '../controllers/distributor.controller.js';
import { verifyUserMiddleware } from '../middleware/user.middleware.js';
import { checkAdminRole } from '../middleware/checkAdminRole.middleware.js';
import { getAllDistributors, updateDistributor } from '../controllers/distributor.controller.js';

const router = express.Router();

router.post('/apply',applyDistributor); // SignUp route
router.get('/all',verifyUserMiddleware,checkAdminRole, getAllDistributors); // SignUp route
router.put('/update-distributor/:distributorId',verifyUserMiddleware,checkAdminRole,updateDistributor); // SignUp route
export default router;
