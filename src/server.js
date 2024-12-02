// Import required modules
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { connectToDatabase } from './db/index';
import routes from './src/controllers/routes'; // Importing all routes from routes/index.js

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

// Set the port
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
