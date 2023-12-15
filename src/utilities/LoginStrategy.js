const he = require('he');
const passport = require('passport');
const { Strategy } = require('passport-strategy');

const LoginForm = require('../Http/Forms/LoginForm.js');

module.exports = class LoginStrategy extends Strategy {
    constructor(verify, options) {
        super();
        this.name = 'LoginStrategy';
        this.verify = verify;
        this.email = (options && options.email) ? options.email : 'Email';
        this.password = (options && options.password) ? options.password : 'Password';
        passport.strategies[this.name] = this;
    }

    async authenticate(req, options) {
        const form = new LoginForm;
        const email = he.encode(req.body[this.email]);
        const password = he.encode(req.body[this.password]);

        if (form.validate(email, password)) {
            if (Object.keys(form.getErrors()).length !== 0) {
                return this.fail(form.getErrors());
            } else {
                await this.verify(email, password, (err, user) => {
                    if (err) {
                        return this.fail(err);
                    }
                    if (user) {
                        return this.success(user, null);
                    }
                });
            }
        }
    }
}