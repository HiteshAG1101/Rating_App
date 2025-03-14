const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { Store, Rating, User } = require('../models');
const { appLogger, errorLogger } = require('../utils/logger');

// Admin: Create a new user
const createUser = async (req, res) => {
    const { name, email, address, password, role } = req.body;
    try {
        // Check if email is taken
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            appLogger.info(`ℹ️ User creation failed: Email ${email} is already registered`);
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, address, role });
        appLogger.info(`ℹ️ User created by admin: ${email}`);
        res.status(201).json({ id: newUser.id, name, email, role });
    } catch (err) {
        errorLogger.error(`❌ User creation error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get filtered list of users
const getUsers = async (req, res) => {
    const { name, email, address, role } = req.query;
    try {
        const users = await User.findAll({
            where: {
                ...(name && {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }),
                ...(email && {
                    email: {
                        [Op.like]: `%${email}%`
                    }
                }),
                ...(address && {
                    address: {
                        [Op.like]: `%${address}%`
                    }
                }),
                ...(role && { role }),
            },
            attributes: ['id', 'name', 'email', 'address', 'role'],
        });
        res.json(users);
    } catch (err) {
        errorLogger.error(`❌ Get users error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        res.json({
            total_users: totalUsers,
            total_stores: totalStores,
            total_ratings: totalRatings,
        });
    } catch (err) {
        errorLogger.error(`❌ Dashboard stats error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// User: Update their password
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            appLogger.info(`ℹ️ Password update failed: Incorrect old password for user ID ${req.user.id}`);
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        appLogger.info(`ℹ️ Password updated for user ID: ${req.user.id}`);
        res.json({ message: 'Password updated' });
    } catch (err) {
        errorLogger.error(`❌ Password update error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createUser, getUsers, getDashboardStats, updatePassword };