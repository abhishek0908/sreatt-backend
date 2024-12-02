import jwt from 'jsonwebtoken';
import StatusCodes from '../utils/statusCodes.js';
const SECRET_KEY = process.env.SECRET_KEY
export const verifyUserMiddleware = (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1]; // Assumes the token is in the format "Bearer <token>"
    console.log(SECRET_KEY)

    // If token is not provided
    if (!token) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'No token provided, access denied.' });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            // If the token is invalid or expired
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
        }

        // If token is valid, save the decoded user information to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
};
