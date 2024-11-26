const dotenv = require('dotenv');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'PROD';

const envPath =
    NODE_ENV === 'TEST'
        ? path.join(__dirname, '.env.test')
        : NODE_ENV === 'PROD'
          ? path.join(__dirname, '.env.prod')
          : path.join(__dirname, '.env.dev');
dotenv.config({ path: envPath });

const { logger } = require('./middlewares/logger');
const { initializeExpressServer } = require('./app');
const { initializeDatabaseConnection } = require('./database');
const { startCrons } = require('./services/crons/startCrons');

const PORT = process.env.PORT || 5050;

async function startServer() {
    await initializeDatabaseConnection();
    const app = initializeExpressServer();

    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    });
}

startServer();
startCrons();
