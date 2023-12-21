const Users = require('../../models/Users.js');
const Restaurants = require('../../models/Restaurants.js');
const Categories = require('../../models/Categories.js');

module.exports = {
    index: async (req, res) => {
        const users = await Users.fetchAll(["id", "Fullname", "Username", "Email", "Role"]);
        const restaurants = await Restaurants.fetchAll();
        const categories = await Categories.fetchAll();

        return res.render('dashboard', {
            title: "Dashboard",
            login: req.isAuthenticated(),
            user: req.user,
            url: req.path,
            users: users,
            restaurants: restaurants,
            categories: categories
        });
    }
}