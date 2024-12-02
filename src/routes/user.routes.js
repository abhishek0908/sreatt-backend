// routes/user.routes.js
const express = require('express');
const router = express.Router();

import { SignIn,SignUp } from '../controllers/user.controllers';
// Define the routes and associate them with controller functions
router.post('/signin', SignIn); // SignIn route
router.post('/signup', SignUp); // SignUp route

module.exports = router;
