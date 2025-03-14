const { Store, Rating } = require('../models');

const { appLogger, errorLogger } = require('../utils/logger');

// Normal User: Submit or update a store rating
const submitRating = async (req, res) => {
    const { store_id } = req.params;
    const { rating } = req.body;
    try {
        // Check if store exists
        const store = await Store.findByPk(store_id);
        if (!store) {
            appLogger.info(`ℹ️ Rating submission failed: Store ID ${store_id} not found`);
            return res.status(404).json({ message: 'Store not found' });
        }

        // Upsert rating (insert or update)
        await Rating.upsert({ user_id: req.user.id, store_id, rating });
        appLogger.info(`ℹ️ Rating submitted by user ID ${req.user.id} for store ID ${store_id}`);
        res.json({ message: 'Rating submitted' });
    } catch (err) {
        errorLogger.error(`❌ Rating submission error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitRating };