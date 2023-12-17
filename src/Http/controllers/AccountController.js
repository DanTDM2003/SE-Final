const bcrypt = require('bcrypt');
const he = require('he');

const Users = require('../../models/Users.js');
const RegisterForm = require('../Forms/RegisterForm.js');
const PasswordForm = require('../Forms/PasswordForm.js');

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

        let { Fullname, Username, Password, Role, Email } = req.body;

        Fullname = he.encode(Fullname);
        Username = he.encode(Username);
        Password = he.encode(Password);
        Role = he.encode(Role);
        Email = he.encode(Email);

        if (form.validate(Fullname, Username, Password, Email)) {
            const user = await Users.findOne({ Email: Email, Password: Password });
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
                url: req.path
            });
        }
    },

    show: async (req, res) => {
        const user = await Users.findOne({ Email: req.user.Email });
        delete user.Password;

        return res.render('account/show', {
            errors: null,
            title: "My Account",
            login: req.user,
            url: req.path,
            user: user
        });
    },

    destroy: async (req, res) => {
        await Users.delete(req.body.id);

        res.redirect('/admin/dashboard');
    },

    update: async (req, res) => {
        const user = await Users.findOne({ Email: req.user.Email });

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
                    }
                }
            }

            return res.render('account/show', {
                errors: form.getErrors(),
                title: 'My Account',
                login: req.user,
                url: req.path,
                user: user
            });
        }
        await Users.update(Object.assign({ id: req.body.id }, req.body));

        res.redirect('back');
    }
}