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

    validate(currentPassword, newPassword, confirmPassword) {
        if (!Validator.stringValidate(currentPassword, 7)) {
            this.setError("currentPassword", "Please enter at least 7 characters for a password.");
        }
        
        if (!Validator.stringValidate(newPassword, 7)) {
            this.setError("newPassword", "Please enter at least 7 characters for a password.");
        }
        
        if (!Validator.stringValidate(confirmPassword, 7)) {
            this.setError("confirmPassword", "Please enter at least 7 characters for a password.");
        }
        
        return Object.keys(this.getErrors()).length == 0;
    }
}