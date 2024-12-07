import jwt from 'jsonwebtoken';  // Import jwt

// Middleware to authorize only admins

export const authorizeCustomer = async (req, res, next) => {
    try {
        // Ensure user data is attached to the request
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized access.' });
        }

        // Check the user's role
        if (req.user.role !== 'customer') {
            return res.status(403).send({ message: 'Access forbidden: Customers only.' });
        }

        next(); // Proceed if the user is an admin
    } catch (error) {
        res.status(500).send({ message: 'An error occurred during authorization.' });
    }
};
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        req.user.role = decoded.role;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid token.' });
    }
};
