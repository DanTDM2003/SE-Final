const Subscribed = require('../../models/Subscribed.js');
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

        if ((await Subscribed.fetchAll([ req.body.User_id, req.body.Restaurant_id ])).length === 0) {
            await Subscribed.add(req.body);
        }
        
        res.redirect('back');
    },

    destroy: async (req, res) => {
        if (req.user.Role !== "Restaurant") {
            if (req.body.User_id != req.user.id) {
                return helpers.abort(req, res, 401);
            }
            const restaurant = await Restaurants.fetchWithRestaurantID(req.body.Restaurant_id);
            if (!restaurant) {
                return helpers.abort(406);
            }
        } else {
            const subscribed = Subscribed.fetchAll([ req.body.User_id, req.body.Restaurant_id ]);
            if (!subscribed) {
                return helpers.abort(406);
            }
        }

        await Subscribed.delete(req.body.User_id, req.body.Restaurant_id);
        res.redirect('back');
    }
}