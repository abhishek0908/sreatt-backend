// routes/index.js
const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./user.routes');
// const productRoutes = require('./product.routes'); // Uncomment this when adding product routes

// Use imported routes
router.use('/user', userRoutes); // Route for user-related operations
// router.use('/product', productRoutes); // Uncomment this when adding product routes

module.exports = router;
