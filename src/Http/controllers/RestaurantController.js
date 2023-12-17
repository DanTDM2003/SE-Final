const Restaurants = require('../../models/Restaurants.js');

module.exports = {
    index: (req, res) => {
        res.render('restaurants/index', {
            title: 'Restaurants',
            login: req.user,
            url: req.path
        });
    },

    destroy: async (req, res) => {
        await Restaurants.delete(req.body.id);
        res.redirect('back');
    }
}