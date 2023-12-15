const Validator = require('../../utilities/Validator.js');

module.exports = class RegisterForm {
    constructor() {
        let errors = {};

        this.setError = (key, error) => {
            errors[key] = error;
        };

        this.getErrors = () => {
            return errors;
        };
    }

    validate(fullname, username, password, email) {
        if (!Validator.stringValidate(fullname, 2)) {
            this.setError("fullname", "Please enter at least 2 characters for a fullname.");
        }

        if (!Validator.stringValidate(username, 2)) {
            this.setError("username", "Please enter at least 2 characters for a username.");
        }
        
        if (!Validator.stringValidate(password, 7)) {
            this.setError("password", "Please enter at least 7 characters for a password.");
        }

        if (!Validator.emailValidate(email)) {
            this.setError("email", "Please enter a valid email address.");
        }
        
        return Object.keys(this.getErrors()).length == 0;
    }
}