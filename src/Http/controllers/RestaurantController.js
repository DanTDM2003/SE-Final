const Restaurants = require('../../models/Restaurants.js');
const Categories = require('../../models/Categories.js');

const helpers = require('../../utilities/helpers.js');

module.exports = {
    index: async (req, res) => {
        const restaurants = await Restaurants.findAll();
        const categories = await Categories.findAll();

        res.render('restaurants/index', {
            title: 'Restaurants',
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user,
            restaurants: restaurants,
            categories: categories
        });
    },

    store: async (req, res) => {
        if (req.body.Owner_id != req.user.id) {
            return helpers.abort(req, res, 401)
        }

        const restaurant = await Restaurants.findOne(req.body);

        if (restaurant) {
            return res.redirect('back');
        }

        await Restaurants.add(req.body);
        res.redirect('back');
    },

    update: async (req, res) => {
        if (req.body.Owner_id != req.user.id) {
            return helpers.abort(req, res, 401)
        }
        delete req.body.Owner_id;
        Restaurants.update(req.body);
        res.redirect('back');
    },

    destroy: async (req, res) => {
        await Restaurants.delete(req.body.id);
        res.redirect('back');
    }
}