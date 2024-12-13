// Import required modules
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
const { json, urlencoded } = bodyParser;
import cors from 'cors';
import connectToDatabase from './db/db.js';
import routes from './routes/routes.js'; // Importing all routes from routes/index.js

// Connect to the database
connectToDatabase();

// Initialize Express app
const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Use routes from routes folder
app.use('/api', routes); // All API routes will be prefixed with '/api'

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Sreatt!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Export the app for Vercel's serverless functions
export default app;
