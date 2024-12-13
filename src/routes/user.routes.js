// routes/user.routes.js
import express from 'express';
const router = express.Router();

import { SignUp,SignIn, getAllDistributors, updateDistributor } from '../controllers/user.controllers.js';
import { verifyUserMiddleware } from '../middleware/user.middleware.js';
import { checkAdminRole } from '../middleware/checkAdminRole.middleware.js';
// Define the routes and associate them with controller functions
router.post('/signin', SignIn); // SignIn route
router.post('/signup', SignUp); // SignUp route
router.get('/distributors',verifyUserMiddleware,checkAdminRole, getAllDistributors); // SignUp route
router.put('/update-distributor/:userId',verifyUserMiddleware,checkAdminRole,updateDistributor); // SignUp route
export default router;
