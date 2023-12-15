const bcrypt = require('bcrypt');
const he = require('he');

const Users = require('../../models/Users.js');
const RegisterForm = require('../Forms/RegisterForm.js');

module.exports = {
    index: async (req, res) => {
        const users = await Users.findAll(["id", "Fullname", "Username", "Email", "Role"]);

        return res.render('dashboard', {
            title: "Dashboard",
            login: req.user,
            url: req.path,
            users: users
        });
    }
}