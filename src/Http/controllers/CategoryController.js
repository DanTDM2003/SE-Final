const Categories = require('../../models/Categories.js');

const helpers = require('../../utilities/helpers.js');

module.exports = {
    store: async (req, res) => {
        if (!(await Categories.fetchWithName(req.body.Name))) {
            await Categories.add(req.body);
        }
        
        res.redirect('back');
    },

    destroy: async (req, res) => {
        if (!(await Categories.fetch(req.body.id))) {
            return helpers.abort(406);
        }

        await Categories.delete(req.body.id);
        res.redirect('back');
    }
}