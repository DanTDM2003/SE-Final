const UsersMigration = require('../migration/Users.js');
const RestaurantsMigration = require('../migration/Restaurants.js');
const CategoriesMigration = require('../migration/Categories.js');
const CommentsMigration = require('../migration/Comments.js');
const SubscribedMigration = require('../migration/Subscribed.js');

const errors = {
    404: "Sorry. Page not found.",
    401: "You are unauthorized to see this page.",
    406: "Not Acceptable."
}

module.exports = {
    abort: (req, res, code=404) => {
        res.status(code).render('error', {
            title: code,
            message: errors[code],
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user
        });
    },

    migrate: async () => {
        await UsersMigration();
        await CategoriesMigration();
        await RestaurantsMigration();
        await CommentsMigration();
        await SubscribedMigration();
    },

    imageFilter: async (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}