const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const upload = multer().fields([
    { name: 'Thumbnail', maxCount: 1 },
    { name: 'Menu', maxCount: 1 }
]);

const Restaurants = require('../../models/Restaurants.js');
const Categories = require('../../models/Categories.js');
const Comments = require('../../models/Comments.js');

const helpers = require('../../utilities/helpers.js');

module.exports = {
    index: async (req, res) => {
        let conditions = [ '', '' ];
        if (req.query.search) {
            conditions[0] = req.query.search;
        }
        if (req.query.category) {
            conditions[1] = req.query.category;
        }
        let restaurants = await Restaurants.fetchAll(conditions);

        const numOfPages = Math.ceil(restaurants.length / 9);

        if (req.query.page && (!isNaN(+req.query.page)) && (+req.query.page > 0 && +req.query.page <= numOfPages)) {
            restaurants = restaurants.slice((+req.query.page - 1) * 9, +req.query.page * 9);
        } else {
            restaurants = restaurants.slice(0, 9);
        }
        
        const categories = await Categories.fetchAll();

        res.render('restaurants/index', {
            title: 'Restaurants',
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user,
            restaurants: restaurants,
            categories: categories,
            query: req.query,
            pages: numOfPages
        });
    },

    show: async (req, res) => {
        const restaurant = await Restaurants.fetchWithRestaurantID(req.params.id);
        const comments = await Comments.fetchAllWithRestaurantID([ restaurant.id ]);
        const categories = await Categories.fetchAll();
        
        res.render('restaurants/show', {
            title: restaurant.Name,
            login: req.isAuthenticated(),
            url: req.path,
            user: req.user,
            restaurant: restaurant,
            comments: comments,
            categories: categories,
            rating: Math.round(comments.reduce((accumulator, obj) => accumulator + obj.Rating, 0) / comments.length)
        });
    },

    store: async (req, res) => {
        if (req.body.Owner_id != req.user.id) {
            return helpers.abort(req, res, 401)
        }

        const restaurant = await Restaurants.fetchWithOwnerID(req.body.Owner_id);

        if (restaurant) {
            return res.redirect('back');
        }

        const resizedThumbnail = await sharp(req.files.Thumbnail[0].path).resize(300, 363).toBuffer();
        const outputThumbnailPath = path.join(__dirname, `/../../public/img/thumbnails/${req.files.Thumbnail[0].filename}`);
        await sharp(resizedThumbnail).toFile(outputThumbnailPath);
        const resizedMenu = await sharp(req.files.Thumbnail[0].path).resize(300, 363).toBuffer();
        const outputMenuPath = path.join(__dirname, `/../../public/img/menus/${req.files.Menu[0].filename}`);
        await sharp(resizedMenu).toFile(outputMenuPath);

        const images = { Thumbnail: req.files.Thumbnail[0].filename, Menu: req.files.Menu[0].filename };

        await Restaurants.add(Object.assign(req.body, images));
        res.redirect('back');
    },

    update: async (req, res) => {
        if (req.body.Owner_id != req.user.id) {
            return helpers.abort(req, res, 401)
        }
        delete req.body.Owner_id;

        let images = {};
        if (req.files) {
            if (req.files.Thumbnail) {
                images.Thumbnail = req.files.Thumbnail[0].filename;
                const resizedImageBuffer = await sharp(req.files.Thumbnail[0].path).resize(300, 363).toBuffer();

                // Define the output file path and name
                const outputFilePath = path.join(__dirname, `/../../public/img/thumbnails/${req.files.Thumbnail[0].filename}`);
            
                // Save the resized image to the specified location
                await sharp(resizedImageBuffer).toFile(outputFilePath);
            }
            if (req.files.Menu) {
                images.Menu = req.files.Menu[0].filename;
                const resizedImageBuffer = await sharp(req.files.Menu[0].path).resize(620, 726).toBuffer();

                // Define the output file path and name
                const outputFilePath = path.join(__dirname, `/../../public/img/menus/${req.files.Menu[0].filename}`);
            
                // Save the resized image to the specified location
                await sharp(resizedImageBuffer).toFile(outputFilePath);
            }
        }

        await Restaurants.update(Object.assign(req.body, images));
        res.redirect('back');
    },

    destroy: async (req, res) => {
        await Restaurants.delete(req.body.id);
        res.redirect('back');
    }
}