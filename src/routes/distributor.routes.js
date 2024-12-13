// routes/user.routes.js
import express from 'express';
import { applyDistributor } from '../controllers/distributor.controller.js';
const router = express.Router();

router.post('/apply',applyDistributor); // SignUp route
export default router;
