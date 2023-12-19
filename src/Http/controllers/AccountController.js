const bcrypt = require('bcrypt');
const he = require('he');

const Users = require('../../models/Users.js');
const Categories = require('../../models/Categories.js');
const Restaurants = require('../../models/Restaurants.js');
const Comments = require('../../models/Comments.js');
const Subscribed = require('../../models/Subscribed.js');

const RegisterForm = require('../Forms/RegisterForm.js');
const PasswordForm = require('../Forms/PasswordForm.js');

const helpers = require('../../utilities/helpers.js');


module.exports = {
    create: (req, res) => {
        res.render('registration/create', {
            errors: null,
            title: 'Registration',
            login: null,
            url: req.path,
            user: req.user
        });
    },

    store: async (req, res) => {
        const form = new RegisterForm();

        let { Fullname, Username, Password, Role, Email } = req.body;

        Fullname = he.encode(Fullname);
        Username = he.encode(Username);
        Password = he.encode(Password);
        Role = he.encode(Role);
        Email = he.encode(Email);

        if (form.validate(Fullname, Username, Password, Email)) {
            const user = await Users.fetch({ Email: Email, Password: Password });
            if (!user) {
                await Users.add({ Fullname, Username, Password: bcrypt.hashSync(Password, 10), Email, Role });

                req.login({ Fullname, Username, Role, Email }, (err) => {
                    res.redirect('/');
                })
            } else {
                form.setError('credential', "The email is already used.");
            }
        } else {
            return res.render('registration/create', {
                errors: form.getErrors(),
                title: 'Registration',
                login: null,
                url: req.path,
                user: req.user
            });
        }
    },

    show: async (req, res) => {
        const user = await Users.fetch({ Email: req.user.Email });
        const categories = await Categories.fetchAll();
        const restaurant = await Restaurants.fetchWithOwnerID(req.user.id);
        const subscribed_restaurants = await Subscribed.fetchAllWithUserID(req.user.id);
        const comments = await Comments.fetchAllWithUserID([ req.user.id ]);
        delete user.Password;

        req.user = user;

        return res.render('account/show', {
            errors: null,
            title: "My Account",
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user,
            categories: categories,
            restaurant: restaurant,
            comments: comments,
            subscribed_restaurants: subscribed_restaurants
        });
    },

    destroy: async (req, res) => {
        await Users.delete(req.body.id);

        res.redirect('/admin/dashboard');
    },

    update: async (req, res) => {
        if (req.user.Role !== "Admin") {
            if (req.body.id != req.user.id) {
                return helpers.abort(req, res, 401)
            }
        }
        const user = await Users.fetch({ Email: req.user.Email });

        if (req.body.change) {
            const form = new PasswordForm();

            if (form.validate(req.body.CurrentPassword, req.body.NewPassword, req.body.ConfirmPassword)) {
                if (!bcrypt.compareSync(req.body.CurrentPassword, user.Password)) {
                    form.setError('currentPassword', "Current password is not correct.");
                } else {
                    if (!(req.body.NewPassword === req.body.ConfirmPassword)) {
                        form.setError('password', "Confirm password and new password is not the same as each other.");
                    } else {
                        req.body = { id: req.body.id, Password: bcrypt.hashSync(req.body.NewPassword, 10) };
                        await Users.update(req.body);
                        return res.redirect('back');
                    }
                }
            }

            return res.render('account/show', {
                errors: form.getErrors(),
                title: 'My Account',
                login: req.isAuthenticated(),
                url: req.path,
                user: req.user
            });
        }
        await Users.update(Object.assign({ id: req.body.id }, req.body));

        res.redirect('back');
    }
}