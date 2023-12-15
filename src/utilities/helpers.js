const JWTAction = require('./JWTAction.js');
const Cookies = require('./Cookies.js');
const UsersMigration = require('../migration/Users.js');

const errors = {
    404: "Sorry. Page not found.",
    401: "You are unauthorized to see this page."
}

module.exports = {
    abort: (req, res, code=404) => {
        const user = Cookies.decodeCookie(req.signedCookies.user);

        res.status(code).render('error', {
            title: code,
            message: errors[code],
            login: user ? JWTAction.decodeJWT(user) : null,
            url: req.path
        });
    },

    migrate: async () => {
        await UsersMigration();
    }
}