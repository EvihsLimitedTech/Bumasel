const express = require('express');
const router = express.Router();

const RouteValidatorSchema = require('./validator');
const routerSchemaValidator = require('../middlewares/route.validator');
const AuthController = require('../controllers/auth.controller'); // Ensure correct path
const { AuthenticatedController, verifyAuth, verifyRefreshAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

router
    .post('/login', routerSchemaValidator(RouteValidatorSchema.Auth.login), AuthController.login)
    .post('/signup', routerSchemaValidator(RouteValidatorSchema.Auth.signup), AuthController.signup)
    .post('/signup-otp', routerSchemaValidator(RouteValidatorSchema.Auth.signup), AuthController.signupWithOtp)
    .post('/update-password', AuthController.updatePassword)
    .post('/logout', verifyAuth(AuthTokenType.Access), AuthenticatedController(AuthController.logout))
    .post(
        '/refresh',
        routerSchemaValidator(RouteValidatorSchema.Auth.refreshToken),
        verifyRefreshAuth(AuthTokenType.Refresh),
        AuthenticatedController(AuthController.refreshToken),
    )
    .get('/verifyemail', AuthController.verifyEmail)
    .post('/verifyemail-otp', AuthController.verifyEmailOtp)
    .post('/reset-password', AuthController.resetPassword)
    .post('/resend-otp', AuthController.resendOtp)
    .post('/verify-reset-otp', AuthController.verifyResetOtp)
    .put('/update-profile', AuthController.updateUserProfile)
    .post('/reset-password-complete', AuthController.resetPasswordComplete);

module.exports = {router};
