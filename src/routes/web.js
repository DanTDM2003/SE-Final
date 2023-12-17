const express = require('express');
const router = express.Router();

const RestaurantController = require('../Http/controllers/RestaurantController.js');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        login: req.isAuthenticated(),
        url: req.path,
        user: req.user
    });
});

router.get('/restaurants', RestaurantController.index);

router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        login: req.isAuthenticated(),
        url: req.path,
        user: req.user
    });
});

module.exports = router;