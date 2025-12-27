const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config(); // Load .env variables

// Database Configuration
const DB_NAME = process.env.DB_NAME || 'unifix_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || 3306;

// 1. Helper: Create Database if it doesn't exist
async function ensureDatabase() {
    try {
        // Connect to MySQL server (without selecting a DB)
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
        });
        // Create DB
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();
        console.log(`✅ Database check: '${DB_NAME}' exists or was created.`);
    } catch (error) {
        console.error('❌ Database creation failed. Check XAMPP/MySQL status.');
        console.error('Error:', error.message);
        process.exit(1); // Stop app if we can't check DB
    }
}

// 2. Initialize Sequelize Instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false, // Set to console.log to see raw SQL queries
    timezone: '+06:00', // Optional: Set to your local timezone (Bangladesh)
    pool: {
        max: 5,     // Maximum number of connections
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        underscored: true, // Use snake_case for DB columns (created_at)
        timestamps: true,  // Automatically manage createdAt/updatedAt
        freezeTableName: true // Prevent pluralizing table names
    }
});

// 3. Connect Function
const connectDB = async () => {
    try {
        await ensureDatabase();
        await sequelize.authenticate();
        console.log('✅ MySQL Connected Successfully');
        
        // Sync models with database
        // alter: true updates tables if you change models without deleting data
        await sequelize.sync({ alter: true }); 
        console.log('✅ Database Models Synced');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };