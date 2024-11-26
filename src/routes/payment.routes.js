const express = require('express');
const router = express.Router();

const PaymentController = require('../controllers/payment.controller');
const { AuthTokenType } = require('../utils/token');
const { verifyAuth, AuthenticatedController } = require('../middlewares/auth');

router
    .post('/initialize', verifyAuth(AuthTokenType.Access), AuthenticatedController(PaymentController.Initialize))
    .get('/confirm/:reference', verifyAuth(AuthTokenType.Access), AuthenticatedController(PaymentController.Confirm))
    .post(
        '/subscription/plan/create',
        verifyAuth(AuthTokenType.Access),
        AuthenticatedController(PaymentController.CreatePlan),
    )
    .get('/webhook', verifyAuth(AuthTokenType.Access), AuthenticatedController(PaymentController.Webhook));

module.exports = { router };
