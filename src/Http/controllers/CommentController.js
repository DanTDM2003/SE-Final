const Comments = require('../../models/Comments.js');
const Restaurants = require('../../models/Restaurants.js');

const helpers = require('../../utilities/helpers.js');

module.exports = {
    store: async (req, res) => {
        if (req.body.User_id != req.user.id) {
            return helpers.abort(req, res, 401);
        }

        const restaurant = await Restaurants.fetchWithRestaurantID(req.body.Restaurant_id);
        if (!restaurant) {
            return helpers.abort(406);
        }

        await Comments.add(req.body);
        res.redirect('back');
    },

    destroy: async (req, res) => {
        if (req.body.User_id != req.user.id) {
            return helpers.abort(req, res, 401);
        }

        const comment = await Comments.fetchAllWithRestaurantID([req.body.id]);
        if (!comment) {
            return helpers.abort(406);
        }

        await Comments.delete(req.body.id);
        res.redirect('back');
    }
}