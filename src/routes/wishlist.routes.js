const express = require('express');
const router = express.Router();
const { verifyAuth, AuthenticatedController } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const WishlistController = require('../controllers/wishlist.controller');


router
     .post("/items" ,verifyAuth(AuthTokenType.Access), AuthenticatedController(WishlistController.GetWishlist))
     .post("/item/add" ,verifyAuth(AuthTokenType.Access), AuthenticatedController(WishlistController.AddToWishlist))
     .post("/item/remove" ,verifyAuth(AuthTokenType.Access), AuthenticatedController(WishlistController.RemoveItem))
     

module.exports = { router }