import connectToDatabase from '../db/db.js';
import StatusCodes from '../utils/statusCodes.js';

export const healthCheck = async (req, res) => {
    try {
        // Attempt to connect to the database
        console.log(req.user)
        const db = await connectToDatabase();
        
        // If successful, send a success response
        console.log("Database is ready to use.");
        res.status(StatusCodes.OK).json({ message: 'Health check passed. Database is connected.' });
    } catch (err) {
        // If an error occurs, log the error and send an error response
        console.error("Error connecting to database:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Health check failed. Unable to connect to the database.', error: err.message });
    }
};
