const Restaurants = require('../../models/Restaurants.js');

module.exports = {
    index: (req, res) => {
        res.render('restaurants/index', {
            title: 'Restaurants',
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user
        });
    },

    destroy: async (req, res) => {
        await Restaurants.delete(req.body.id);
        res.redirect('back');
    }
}