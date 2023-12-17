const UsersMigration = require('../migration/Users.js');
const RestaurantsMigration = require('../migration/Restaurants.js');
const CategoriesMigration = require('../migration/Categories.js');

const errors = {
    404: "Sorry. Page not found.",
    401: "You are unauthorized to see this page."
}

module.exports = {
    abort: (req, res, code=404) => {
        res.status(code).render('error', {
            title: code,
            message: errors[code],
            login: req.user,
            url: req.path
        });
    },

    migrate: async () => {
        await UsersMigration();
        await CategoriesMigration();
        await RestaurantsMigration();
    }
}