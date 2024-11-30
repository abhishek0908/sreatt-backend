require('dotenv').config(); // Load environment variables from .env

const { MongoClient } = require('mongodb');

// Function to connect to MongoDB and return the database
async function connectToDatabase() {
  const uri = process.env.MONGO_URI; // MongoDB URI from .env
  const dbName = process.env.DB_NAME; // Database name from .env

  const client = new MongoClient(uri); // No need for useNewUrlParser and useUnifiedTopology

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    
    // Return the database object
    return db;
  } catch (err) {
    console.error("Connection failed:", err);
    throw new Error(`Database connection failed${dbName,uri}`);
  }
}

module.exports = { connectToDatabase };
