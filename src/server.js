import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectToDatabase from './db/db.js';
import routes from './routes/routes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Welcome to Sreatt!');
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(8000, () => {
      console.log(`🚀 Server is running on http://localhost:8000`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
