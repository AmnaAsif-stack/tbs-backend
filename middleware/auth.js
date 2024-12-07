import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Authentication middleware to check the JWT token and attach user to request object
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];  // Get token from 'Authorization: Bearer <token>'

    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.user = await User.findById(decoded.userId).select('-password');  // Attach user to request

        if (!req.user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        next();  // Proceed to the next middleware or controller
    } catch (error) {
        res.status(401).send({ message: 'Invalid token.' });
    }
};
export default authenticateToken;  // Default export
