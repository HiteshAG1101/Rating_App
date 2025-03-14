require('dotenv').config(); // Load environment variables
const sequelize = require('../config');
const User = require('../models/user.model'); // Or import from your central models/index.js if available
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        // Ensure that the tables exist
        await sequelize.sync();

        // ---- Admin User ----
        const adminEmail = 'admin@example.com';
        let admin = await User.findOne({ where: { email: adminEmail } });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
            admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                address: '123 Admin Street, Pune, Maharashtra',
                role: 'admin'
            });
            console.log('Created admin user:', admin.email);
        } else {
            console.log('Admin user already exists:', admin.email);
        }

        // ---- Normal User ----
        const normalEmail = 'normal@example.com';
        let normalUser = await User.findOne({ where: { email: normalEmail } });
        if (!normalUser) {
            const hashedPassword = await bcrypt.hash('NormalPass123!', 10);
            normalUser = await User.create({
                name: 'Normal User',
                email: normalEmail,
                password: hashedPassword,
                address: '456 Normal Avenue, Pune, Maharashtra',
                role: 'normal'
            });
            console.log('Created normal user:', normalUser.email);
        } else {
            console.log('Normal user already exists:', normalUser.email);
        }

        // ---- Store Owner ----
        const ownerEmail = 'owner@example.com';
        let storeOwner = await User.findOne({ where: { email: ownerEmail } });
        if (!storeOwner) {
            const hashedPassword = await bcrypt.hash('OwnerPass123!', 10);
            storeOwner = await User.create({
                name: 'Store Owner',
                email: ownerEmail,
                password: hashedPassword,
                address: '789 Store Lane, Pune, Maharashtra',
                role: 'store_owner'
            });
            console.log('Created store owner:', storeOwner.email);
        } else {
            console.log('Store owner already exists:', storeOwner.email);
        }
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await sequelize.close();
    }
};

seedUsers();