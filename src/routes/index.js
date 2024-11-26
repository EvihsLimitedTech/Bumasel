const { Router } = require('express');
const { router: authRoute } = require('./auth.routes');
const { router: goodsRoute } = require('./goods.routes');
const { router: reviewsRoute } = require('./reviews.routes');
const { router: storeRoutes } = require('../routes/store.routes');
const { router: userRoute } = require('../routes/user.routes');
const { router: paymentRoutes } = require('../routes/payment.routes');
const { router: wishlistRoutes } = require('../routes/wishlist.routes');

const router = Router();

router
    .use('/auth', authRoute)
    .use('/products', goodsRoute)
    .use('/store', storeRoutes)
    .use('/reviews', reviewsRoute)
    .use('/user', userRoute)
    .use('/store', storeRoutes)
    .use('/payment', paymentRoutes)
    .use('/wishlist', wishlistRoutes)
    .use('/reviews', reviewsRoute);

module.exports = { routeHandler: router };
