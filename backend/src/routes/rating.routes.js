const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate.middleware');
const { submitRating } = require('../controllers/rating.controller');
const { verifyToken, verifyNormalUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Normal User: Submit rating
router.put('/:store_id/rating', verifyToken, verifyNormalUser, [
    body('rating').isInt({ min: 1, max: 5 }), // Rating must be 1-5
], validate, submitRating);

module.exports = router;