const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const UserController = require('../controllers/user.controller');

// Route to create a new user
router
    .post('/', verifyAuth(AuthTokenType.Access), UserController.createUser)

    // Route to get all users
    .get('/', verifyAuth(AuthTokenType.Access), UserController.getAllUsers)

    // Route to get a single user by ID
    .get('/:id', verifyAuth(AuthTokenType.Access), UserController.getUserById)

    // Route to update an existing user by ID
    .put('/:id', verifyAuth(AuthTokenType.Access), UserController.updateUser)

    // Route to delete a user by ID
    .delete('/:id', verifyAuth(AuthTokenType.Access), UserController.deleteUser);

module.exports = { router };
