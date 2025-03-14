const jwt = require('jsonwebtoken');
const { errorLogger } = require('../utils/logger');

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        errorLogger.error('❌ Access denied: No token provided');
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        errorLogger.error(`❌ Invalid token: ${err.message}`);
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Verify if the user is an admin
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        errorLogger.error(`❌ Admin access required: User role is ${req.user.role}`);
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Verify if the user is a normal user
const verifyNormalUser = (req, res, next) => {
    if (req.user.role !== 'normal') {
        errorLogger.error(`❌ Normal user access required: User role is ${req.user.role}`);
        return res.status(403).json({ message: 'Normal user access required' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin, verifyNormalUser };