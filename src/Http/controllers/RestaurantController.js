const Restaurants = require('../../models/Restaurants.js');
const Categories = require('../../models/Categories.js');
const Comments = require('../../models/Comments.js');

const helpers = require('../../utilities/helpers.js');

module.exports = {
    index: async (req, res) => {
        let conditions = [ '', '' ];
        if (req.query.search) {
            conditions[0] = req.query.search;
        }
        if (req.query.category) {
            conditions[1] = req.query.category;
        }
        let restaurants = await Restaurants.fetchAll(conditions);

        const numOfPages = Math.ceil(restaurants.length / 9);

        if (req.query.page && (!isNaN(+req.query.page)) && (+req.query.page > 0 && +req.query.page <= numOfPages)) {
            restaurants = restaurants.slice((+req.query.page - 1) * 9, +req.query.page * 9);
        } else {
            restaurants = restaurants.slice(0, 9);
        }
        
        const categories = await Categories.fetchAll();

        res.render('restaurants/index', {
            title: 'Restaurants',
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user,
            restaurants: restaurants,
            categories: categories,
            query: req.query,
            pages: numOfPages
        });
    },

    show: async (req, res) => {
        const restaurant = await Restaurants.fetchWithRestaurantID(req.params.id);
        const comments = await Comments.fetchAllWithRestaurantID([ restaurant.id ]);
        
        res.render('restaurants/show', {
            title: restaurant.Name,
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user,
            restaurant: restaurant,
            comments: comments
        });
    },

    store: async (req, res) => {
        if (req.body.Owner_id != req.user.id) {
            return helpers.abort(req, res, 401)
        }

        const restaurant = await Restaurants.fetchWithOwnerID(req.body.Owner_id);

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