const passport = require('passport');
const bcrypt = require('bcrypt');
const Users = require('../models/Users.js');
const LoginStrategy = require('../utilities/LoginStrategy.js');

passport.serializeUser((user, done) => {
    done(null, user.Email);
});

passport.deserializeUser(async (user, done) => {
    const auth = await Users.findOne({ Email: user });
    delete auth.Password;
    if (auth) {
        return done(null, auth);
    }
    done({ credential: "Your credential is invalid." });
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LoginStrategy(async (email, password, done) => {
        try {
            const user = await Users.findOne({ Email: email });
            
            if (user) {
                const rs = await bcrypt.compare(password, user.Password);
                if (rs) {
                    return done(null, user);
                }
            }

            done({ credential: "Your credential is invalid." }, null);
        } catch (error) {
            done({ error: "Something wrong happens." });
        }
    }));
}