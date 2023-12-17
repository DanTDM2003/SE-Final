const Users = require('../../models/Users.js');
const Restaurants = require('../../models/Restaurants.js');

module.exports = {
    index: async (req, res) => {
        const users = await Users.findAll(["id", "Fullname", "Username", "Email", "Role"]);
        const restaurants = await Restaurants.findAll();

        return res.render('dashboard', {
            title: "Dashboard",
            login: req.user,
            url: req.path,
            users: users,
            restaurants: restaurants
        });
    }
}