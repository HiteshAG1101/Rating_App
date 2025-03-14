const { Op } = require('sequelize');

const { Store, Rating, User } = require('../models');
const { appLogger, errorLogger } = require('../utils/logger');

// Admin: Create a new store
const createStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;
    try {
        // Validate owner is a store_owner
        const owner = await User.findByPk(owner_id);
        if (!owner || owner.role !== 'store_owner') {
            appLogger.info(`ℹ️ Store creation failed: Owner ID ${owner_id} is not a valid store owner`);
            return res.status(400).json({ message: 'Owner must be a store_owner' });
        }
        const newStore = await Store.create({ name, email, address, owner_id });
        appLogger.info(`ℹ️ New store created: ${name} (ID: ${newStore.id}) by owner ID ${owner_id}`);
        res.status(201).json(newStore);
    } catch (err) {
        errorLogger.error(`❌ Store creation error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Get stores (all users, with user-specific ratings for normal users)
const getStores = async (req, res) => {
    const { name, address } = req.query;
    try {
        const stores = await Store.findAll({
            where: {
                ...(name && {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }),
                ...(address && {
                    address: {
                        [Op.like]: `%${address}%`
                    }
                }),
            },
            include: [{
                model: Rating,
                as: 'ratings',
                attributes: ['rating'],
            },],
        });

        let result = stores.map(store => ({
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            average_rating: store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : null,
        }));

        if (req.user.role === 'normal') {
            const userRatings = await Rating.findAll({ where: { user_id: req.user.id } });
            const ratingMap = userRatings.reduce((map, r) => ({ ...map, [r.store_id]: r.rating }), {});
            result = result.map(store => ({
                ...store,
                user_rating: ratingMap[store.id] || null,
            }));
        }

        res.json(result);
    } catch (err) {
        errorLogger.error(`❌ Get stores error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Store Owner: View their store details
const getMyStore = async (req, res) => {
    if (req.user.role !== 'store_owner') {
        appLogger.info(`ℹ️ Access denied: Store owner access required for user ID ${req.user.id}`);
        return res.status(403).json({ message: 'Store owner access required' });
    }
    try {
        const store = await Store.findOne({ where: { owner_id: req.user.id } });
        if (!store) {
            appLogger.info(`ℹ️ Store not found for owner ID ${req.user.id}`);
            return res.status(404).json({ message: 'Store not found' });
        }
        const ratings = await Rating.findAll({
            where: { store_id: store.id },
            include: [{ model: User, as: 'user', attributes: ['name'] }],
        });
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : null;
        res.json({
            store,
            ratings: ratings.map(r => ({ user: r.user.name, rating: r.rating })),
            average_rating: averageRating,
        });
    } catch (err) {
        errorLogger.error(`❌ Get my store error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createStore, getStores, getMyStore };