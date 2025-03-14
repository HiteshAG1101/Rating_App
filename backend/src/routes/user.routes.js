const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate.middleware');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const { createUser, getUsers, getDashboardStats, updatePassword } = require('../controllers/user.controller');

const router = express.Router();

// Admin: Create user
router.post('/', verifyToken, verifyAdmin, [
    body('name').isLength({ min: 20, max: 60 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),
    body('role').isIn(['admin', 'normal', 'store_owner']),
], validate, createUser);

// Admin: Get users with filters
router.get('/', verifyToken, verifyAdmin, getUsers);

// Admin: Get dashboard stats
router.get('/dashboard', verifyToken, verifyAdmin, getDashboardStats);

// User: Update password
router.put('/me/password', verifyToken, [
    body('oldPassword').exists(),
    body('newPassword').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),
], validate, updatePassword);

module.exports = router;