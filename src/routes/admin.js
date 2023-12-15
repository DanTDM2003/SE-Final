const express = require('express');
const router = express.Router();

const SessionController = require('../Http/controllers/SessionController.js');
const AccountController = require('../Http/controllers/AccountController.js');
const AdministratorController = require('../Http/controllers/AdministratorController.js');
const AuthMiddleware = require('../middlewares/Auth.js');
const GuestMiddleware = require('../middlewares/Guest.js');

router.route('/dashboard')
        .get(AuthMiddleware, AdministratorController.index);

module.exports = router;