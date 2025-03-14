const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate.middleware');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const { createStore, getStores, getMyStore } = require('../controllers/store.controller');

const router = express.Router();

// Admin: Create store
router.post('/', verifyToken, verifyAdmin, [
    body('name').isLength({ min: 20, max: 60 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('owner_id').isInt(),
], validate, createStore);

// All users: Get stores
router.get('/', verifyToken, getStores);

// Store Owner: Get their store
router.get('/my-store', verifyToken, getMyStore);

module.exports = router;