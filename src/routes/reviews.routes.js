const express = require('express');
const router = express.Router();
const ReviewsController = require('../controllers/reviews.controller')
const { verifyAuth, AuthenticatedController } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

router.post('/send-review', ReviewsController.createReview);
router.get('/get-reviews/:goods_id', ReviewsController.getReviews);

module.exports = { router };