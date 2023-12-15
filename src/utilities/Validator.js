module.exports = {
    stringValidate: (input='', min=7, max=Infinity) => {
        input = input.trim();

        return input.length >= min && input.length <= max;
    },

    emailValidate: (email='') => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    },

    phoneNumberValidate(phoneNumber) {
        const pattern = /^\d{10}$/; // Matches a 10-digit number
      
        return pattern.test(phoneNumber);
    }
}