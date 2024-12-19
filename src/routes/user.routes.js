// routes/user.routes.js
import express from 'express';
const router = express.Router();

import { SignUp,SignIn } from '../controllers/user.controllers.js';

// Define the routes and associate them with controller functions
router.post('/signin', SignIn); // SignIn route
router.post('/signup', SignUp); // SignUp route
export default router;
