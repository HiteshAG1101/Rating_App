const { User } = require('../models');
const { appLogger, errorLogger } = require('../utils/logger');
const { hashPassword, comparePassword, generateToken } = require('../helper/auth.helper');

// Handle user signup
const signup = async (req, res) => {
    const { name, email, address, password } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            appLogger.info(`ℹ️ Signup attempt failed: Email ${email} is already registered`);
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ name, email, password: hashedPassword, address, role: 'normal' });
        appLogger.info(`ℹ️ New user signed up successfully: ${email}`);
        res.status(201).json({ id: newUser.id, name, email, role: 'normal' });
    } catch (err) {
        errorLogger.error(`❌ Signup failed for ${email}: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Handle user login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            appLogger.info(`ℹ️ Login attempt failed: No user found with email ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            appLogger.info(`ℹ️ Login attempt failed: Incorrect password for ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        appLogger.info(`ℹ️ User logged in successfully: ${email}`);
        res.json({ token });
    } catch (err) {
        errorLogger.error(`❌ Login failed for ${email}: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login };