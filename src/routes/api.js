const express = require('express');
const multer = require('multer');
const passport = require('passport');
const path = require('path');
const router = express.Router();

const appRoot = require('app-root-path');
const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, appRoot + "/src/public/uploads/");
        },
    
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
});

const helpers = require('../utilities/helpers.js');

let upload = multer({ storage: storage, fileFilter: helpers.imageFilter });

const SessionController = require('../Http/controllers/SessionController.js');
const AccountController = require('../Http/controllers/AccountController.js');
const RestaurantController = require('../Http/controllers/RestaurantController.js');
const CommentController = require('../Http/controllers/CommentController.js');
const SubscribedController = require('../Http/controllers/SubscribedController.js');
const CategoryController = require('../Http/controllers/CategoryController.js');

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
router.post('/subscribed/delete', AuthMiddleware, SubscribedController.destroy);

router.post('/comment/create', AuthMiddleware, CommentController.store);
router.post('/comment/delete', AuthMiddleware, CommentController.destroy);

router.post('/category/delete', AdminMiddleware, CategoryController.destroy);
router.post('/category/create', AdminMiddleware, CategoryController.store);

router.get('/restaurant/:id', RestaurantController.show);
router.post('/restaurant/delete', AdminMiddleware, RestaurantController.destroy);
router.post('/restaurant/update', RestaurantMiddleware, upload.fields([
        { name: 'Thumbnail', maxCount: 1 },
        { name: 'Menu', maxCount: 1 }
]), RestaurantController.update);

router.post('/restaurant/create', RestaurantMiddleware, upload.fields([
        { name: 'Thumbnail', maxCount: 1 },
        { name: 'Menu', maxCount: 1 }
]), RestaurantController.store);

module.exports = router;