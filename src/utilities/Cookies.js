require('dotenv').config();
const cookieParser = require('cookie-parser');

const key = process.env.COOKIE_SECRET_KEY;

module.exports = {
    createCookie: (res, key='', data, signed=false, remember=false) => {
        if (remember) {
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            const expirationDate = new Date(Date.now() + thirtyDays);
            res.cookie(key, data, { signed: signed, maxAge: thirtyDays, expires: expirationDate });
        } else {
            res.cookie(key, data, { signed: signed });
        }
        
    },

    deleteCookie: (res, key='') => {
        res.cookie(key, undefined, { maxAge: 0, expires: new Date(-1) });
    },

    decodeCookie: (token) => {
        const data = cookieParser.signedCookie(token, key);

        return data;
    }
}