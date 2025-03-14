const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hash a password
const hashPassword = async(password) => {
    return await bcrypt.hash(password, 10);
};

// Compare a password with its hash
const comparePassword = async(password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { hashPassword, comparePassword, generateToken };