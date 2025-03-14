const express = require('express');
const cors = require('cors')

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const storeRoutes = require('./routes/store.routes');
const ratingRoutes = require('./routes/rating.routes');

const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(cors());

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/stores', storeRoutes);
app.use('/ratings', ratingRoutes);

module.exports = app;