const express = require('express');
const router = express.Router();
const { verifyAuth, AuthenticatedController } = require('../middlewares/auth');
const StoreRoutes = require('../controllers/store.controller');
const { AuthTokenType } = require('../utils/token');

router
    .post('/create', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.createStore))
    .post('/update/:id', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.updateStore))
    .post('/get/id/:id', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.getStoreById))
    .post('/get/:slug', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.getStoreBySlug))
    .post('/delete/:id', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.deleteStore))
    .post('/type/create', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.createStoreType))
    .post('/type/get', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.getStoreType))
    .post('/type/delete/:id', verifyAuth(AuthTokenType.Access), AuthenticatedController(StoreRoutes.deleteStoreType));

module.exports = { router };
