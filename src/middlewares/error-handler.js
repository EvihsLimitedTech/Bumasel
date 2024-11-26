const { CustomAPIError } = require('../utils/error');
const { logger } = require('./logger');
const { ZodError } = require('zod');
const { JsonWebTokenError } = require('jsonwebtoken');

function errorHandler(err, req, res, next) {
    // console.error(err);
    logger.error(err.stack);
    if (err instanceof CustomAPIError && err.statusCode !== 500) {
        return res.status(err.statusCode).send({
            status: 'error',
            message: err.message,
        });
    }
    if (err instanceof ZodError) {
        return res.status(400).send({
            status: 'error',
            errors: err.errors,
            message: 'Validation Error',
        });
    }
    if (err instanceof JsonWebTokenError) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({
                status: 'error',
                message: 'Token Expired',
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({
                status: 'error',
                message: 'Invalid Token',
            });
        }
    }
    // if the error is not one of the specific types above, return a generic internal server error
    return res.status(500).send({ status: 'error', message: 'Ops, Something went wrong' });
}

module.exports = { errorHandler };
