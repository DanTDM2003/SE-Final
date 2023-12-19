const express = require('express');
const router = express.Router();

const SessionController = require('../Http/controllers/SessionController.js');
const AccountController = require('../Http/controllers/AccountController.js');
const RestaurantController = require('../Http/controllers/RestaurantController.js');
const CommentController = require('../Http/controllers/CommentController.js');
const SubscribedController = require('../Http/controllers/SubscribedController.js');

const AuthMiddleware = require('../middlewares/Auth.js');
const GuestMiddleware = require('../middlewares/Guest.js');
const AdminMiddleware = require('../middlewares/Admin.js');
const RestaurantMiddleware = require('../middlewares/Restaurant.js');

router.route('/login')
        .get(GuestMiddleware, SessionController.create)
        .post(GuestMiddleware, SessionController.store);

router.get('/logout', AuthMiddleware, SessionController.destroy);

router.route('/register')
        .get(GuestMiddleware, AccountController.create)
        .post(GuestMiddleware, AccountController.store);

router.post('/user/delete', AdminMiddleware, AccountController.destroy);
router.post('/user/update', AuthMiddleware, AccountController.update);
router.get('/user/information', AuthMiddleware, AccountController.show);

router.post('/subscribed', AuthMiddleware, SubscribedController.store);

router.post('/comment/create', AuthMiddleware, CommentController.store);
router.post('/comment/delete', AuthMiddleware, CommentController.destroy);

router.get('/restaurant/:id', RestaurantController.show);
router.post('/restaurant/delete', AdminMiddleware, RestaurantController.destroy);
router.post('/restaurant/create', RestaurantMiddleware, RestaurantController.store);
router.post('/restaurant/update', RestaurantMiddleware, RestaurantController.update);

module.exports = router;