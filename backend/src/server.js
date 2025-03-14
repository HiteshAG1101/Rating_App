require('dotenv').config(); // Load environment variables from .env
const app = require('./app');
const mysql = require('mysql2/promise');

const sequelize = require('./config/index');
const { appLogger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const createDatabaseIfNotExists = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.end();
        appLogger.info('Database ensured.');
    } catch (error) {
        appLogger.error(`Failed to create database: ${error.message}`);
        throw error;
    }
};

// Sync database and start server
const startServer = async () => {
    try {
        await createDatabaseIfNotExists();
        await sequelize.sync({ force: false });
        appLogger.info('Database and tables created successfully');
        app.listen(PORT, () => {
            appLogger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        appLogger.error(`Failed to start server: ${error.message}`);
    }
};

startServer();