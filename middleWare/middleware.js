const jwt = require('jsonwebtoken');
const userModel = require('../Models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            throw new Error('Please provide a valid token.');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Debugging: Find the user document by ID first
        const userById = await userModel.findById(decoded._id);
        if (!userById) {
            throw new Error('User not found.');
        }
        // Check if the token exists in the user's tokens array
        const user = await userModel.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error('Token not found in user tokens.');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        console.error(e);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};



// Middleware for admin role check
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
