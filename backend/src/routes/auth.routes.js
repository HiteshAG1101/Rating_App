const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate.middleware');
const { signup, login } = require('../controllers/auth.controller');

const router = express.Router();

// Signup route with validation
router.post('/signup', [
    body('name').isLength({ min: 20, max: 60 }), // Name: 20-60 characters
    body('email').isEmail(), // Valid email format
    body('address').isLength({ max: 400 }), // Address: max 400 characters
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/), // Password: 8-16 chars, 1 uppercase, 1 special
], validate, signup);

// Login route with validation
router.post('/login', [
    body('email').isEmail(),
    body('password').exists(), // Password must be provided
], validate, login);

module.exports = router;