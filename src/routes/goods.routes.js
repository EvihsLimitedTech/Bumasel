const express = require('express');
const router = express.Router();
const goodsController = require('../controllers/goods.controller');
const { AuthenticatedController, verifyAuth, verifyRefreshAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

// Define routes for CRUD operations
router.post('/create-product', verifyAuth(AuthTokenType.Access), async (req, res) => {
    try {
        const product = await AuthenticatedController(goodsController.createProduct(req.body));
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/all-products', goodsController.getAllProducts);
router.get('/get-products', goodsController.getProducts),
router.get('/get-product/:id', verifyAuth(AuthTokenType.Access), AuthenticatedController(goodsController.getProductById));
router.patch('/update-product', verifyAuth(AuthTokenType.Access), AuthenticatedController(goodsController.updateProduct));
router.delete('/delete-product', verifyAuth(AuthTokenType.Access), AuthenticatedController(goodsController.deleteProduct));

module.exports = { router };
