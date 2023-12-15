const bcrypt = require('bcrypt');
const he = require('he');

const Users = require('../../models/Users.js');
const RegisterForm = require('../Forms/RegisterForm.js');

module.exports = {
    create: (req, res) => {
        res.render('registration/create', {
            errors: null,
            title: 'Registration',
            login: null,
            url: req.path
        });
    },

    store: async (req, res) => {
        const form = new RegisterForm();

        let { Fullname, Username, Password, Email } = req.body;

        Fullname = he.encode(Fullname);
        Username = he.encode(Username);
        Password = he.encode(Password);
        Email = he.encode(Email);

        if (form.validate(Fullname, Username, Password, Email)) {
            const user = await Users.findOne({ Email: Email, Password: Password });
            if (!user) {
                await Users.add({ Fullname, Username, Password: bcrypt.hashSync(Password, 10), Email });

                req.login({ Fullname, Username, Email }, (err) => {
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
                url: req.path
            });
        }
    },

    show: async (req, res) => {
        return res.render('account/show', {
            title: "My Account",
            login: req.user,
            url: req.path
        });
    },

    destroy: async (req, res) => {
        await Users.delete(req.body.id);

        res.redirect('/admin/dashboard');
    }
}