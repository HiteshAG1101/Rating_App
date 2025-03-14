// scripts/seedStores.js
require('dotenv').config(); // Load environment variables
const sequelize = require('../config/index');
const Store = require('../models/store.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const seedStores = async () => {
    try {
        // Ensure that the tables exist
        await sequelize.sync();

        // Check if a store owner with a specific email already exists
        let owner = await User.findOne({ where: { email: 'storeowner@pune.com' } });
        if (!owner) {
            // Create a dummy store owner for Pune with a realistic name and address
            const hashedPassword = await bcrypt.hash('RealOwnerPass123!', 10);
            owner = await User.create({
                name: 'Ravi Deshpande',
                email: 'storeowner@pune.com',
                password: hashedPassword,
                address: '123 MG Road, Pune, Maharashtra',
                role: 'store_owner'
            });
            console.log('Created store owner:', owner.email);
        } else {
            console.log('Store owner already exists:', owner.email);
        }

        // Define an array of 20 dummy stores with real names and Pune addresses
        const puneStores = [{
            name: 'FC Road Emporium',
            email: 'fcr@pune.com',
            address: 'FC Road, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'MG Road Bazaar',
            email: 'mgrbazaar@pune.com',
            address: 'MG Road, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Laxmi Road Market',
            email: 'laxmir@pune.com',
            address: 'Laxmi Road, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Koregaon Park Boutique',
            email: 'koregaon@pune.com',
            address: 'Koregaon Park, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'JM Road Store',
            email: 'jmroad@pune.com',
            address: 'JM Road, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Deccan Square Retail',
            email: 'deccansquare@pune.com',
            address: 'Deccan Square, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Baner Mall',
            email: 'banermall@pune.com',
            address: 'Baner, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Hinjewadi Electronics',
            email: 'hinjewadi@pune.com',
            address: 'Hinjewadi, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Viman Nagar Outlet',
            email: 'vimanoutlet@pune.com',
            address: 'Viman Nagar, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Kothrud Collections',
            email: 'kothrud@pune.com',
            address: 'Kothrud, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Wakad Fashion',
            email: 'wakadfashion@pune.com',
            address: 'Wakad, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Camp Corner',
            email: 'campcorner@pune.com',
            address: 'Camp, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Hadapsar Home Goods',
            email: 'hadapsar@pune.com',
            address: 'Hadapsar, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Kalyani Nagar Shop',
            email: 'kalyaninagar@pune.com',
            address: 'Kalyani Nagar, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Aundh Plaza',
            email: 'aundhplaza@pune.com',
            address: 'Aundh, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Vita Hub',
            email: 'vitahub@pune.com',
            address: 'Vita, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Magarpatta Mart',
            email: 'magarpatta@pune.com',
            address: 'Magarpatta, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Parvati Premium',
            email: 'parvati@pune.com',
            address: 'Parvati, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Koregaon Colony',
            email: 'koregaoncolony@pune.com',
            address: 'Koregaon Colony, Pune, Maharashtra',
            owner_id: owner.id
        },
        {
            name: 'Sinhagad Supermarket',
            email: 'sinhagad@pune.com',
            address: 'Sinhagad Road, Pune, Maharashtra',
            owner_id: owner.id
        }
        ];

        // Bulk insert the dummy stores into the database
        const stores = await Store.bulkCreate(puneStores);
        console.log('Stores added successfully:', stores.map(store => store.name));
    } catch (error) {
        console.error('Error adding dummy stores:', error);
    } finally {
        await sequelize.close();
    }
};

seedStores();