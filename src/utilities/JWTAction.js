require('dotenv').config();
const jwt = require('jsonwebtoken');

const key = process.env.JWT_SECRET_KEY;

module.exports = {
    createJWT: (data) => {
        let token = null;
        try {
            token = jwt.sign(data, key);
        } catch (error) {
            console.log(error);
        }

        return token;
    },

    decodeJWT: (token) => {
        let data = null;
        try {
            data = jwt.verify(token, key);
        } catch (error) {
            console.log(error);
        }

        return data;
    }
}