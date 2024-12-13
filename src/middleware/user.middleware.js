import jwt from 'jsonwebtoken';
import StatusCodes from '../utils/statusCodes.js';
import  User  from '../db/user.model.js';  // Assuming you have a User model

const SECRET_KEY = process.env.SECRET_KEY;

export const verifyUserMiddleware = async (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1]; // Assumes the token is in the format "Bearer <token>"

    // If token is not provided
    if (!token) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'No token provided, access denied.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Fetch the full user details from the database based on the email in the token
        const user = await User.findOne({ email: decoded.email });

        // If no user is found, return an error
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found.' });
        }

        // If token is valid, save the full user object to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // If the token is invalid or expired
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
    }
};
