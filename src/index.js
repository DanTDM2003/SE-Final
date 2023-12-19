require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sanitizeHtml = require('sanitize-html');
const flash = require('express-flash');

const app = express();
const viewEngine = require('./config/viewEngine.js');
const helpers = require('./utilities/helpers.js');
const Cookies = require('./utilities/Cookies.js');
const JWTAction = require('./utilities/JWTAction.js');

const port = process.env.PORT;
const host = process.env.HOST;
const secret = process.env.COOKIE_SECRET_KEY;

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(cookieParser(secret));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.all((req, res, next) => {
    req.path = sanitizeHtml(req.path);
    next();
});

viewEngine(app);

helpers.migrate();

require('./modules/passport.js')(app);

app.use((req, res, next) => {
    if (req.signedCookies.user) {
        const token = Cookies.decodeCookie(req.signedCookies.user);
        const user = JWTAction.decodeJWT(token);
        req.login(user, (err) => {
            return next();
        });
    } else {
        return next();
    }
})

app.use(require('./routes/web.js'));
app.use(require('./routes/api.js'));
app.use('/admin', require('./routes/admin.js'));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;

    next(error);
});

app.use((err, req, res, next) => {
    helpers.abort(req, res, err.status);
});

app.listen(port, host, () => {
    console.log("Server has started.");
});