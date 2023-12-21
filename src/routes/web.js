const express = require('express');
const router = express.Router();

const RestaurantController = require('../Http/controllers/RestaurantController.js');

const Restaurants = require('../models/Restaurants.js');

router.get('/', async (req, res) => {
    const newlyOpenedRestaurants = await Restaurants.fetchAll();

    res.render('index', {
        title: 'Home',
        login: req.isAuthenticated(),
        url: req.path,
        user: req.user,
        newlyOpenedRestaurants: newlyOpenedRestaurants.slice(0, 10)
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