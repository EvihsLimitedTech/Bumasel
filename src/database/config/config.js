require('dotenv').config();
const env = process.env.NODE_ENV;

const development = {
    database: process.env.PG_DATABASE,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // Ensure SSL is required
            rejectUnauthorized: false, // Disable certificate validation (for dev/testing only)
        },
        version: '15.1',
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

const testing = {
    database: 'databasename',
    username: 'username',
    password: 'password',
    host: 'localhost',
    dialect: 'postgres',
};

const production = {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        // socketPath: process.env.DB_HOST,
        ssl: {
            require: true,
            // other SSL options as needed

            rejectUnauthorized: false, // Disables certificate validation
        },
    },
};

module.exports = {
    development,
    testing,
    production,
};
