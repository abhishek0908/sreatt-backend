// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {connectToDatabase} = require('./db/index')
// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js App!');
});
app.get('/health', async(req, res) => {
    try {
        // Call the function to connect to the database
        const db = await connectToDatabase();
    
        // You can now use 'db' for any database operations
    
        // Send a health response
        res.status(200).json({ status: 'Healthy', message: 'Connected to MongoDB', dbName: db.databaseName });
      } catch (err) {
        // In case of connection failure
        res.status(500).json({ status: 'Unhealthy', message: 'Database connection failed' });
      }    

});
app.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({ message: 'Data received', data });
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
