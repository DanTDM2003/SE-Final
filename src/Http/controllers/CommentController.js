const Comments = require('../../models/Comments.js');

module.exports = {
    store: async (req, res) => {
        console.log("gay");
        if (req.body.User_id != req.user.id) {
            return helpers.abort(req, res, 401);
        }

        console.log("gay");
        await Comments.add(req.body);
        res.redirect('back');
    },

    destroy: async (req, res) => {
        await Comments.delete(req.body.id);
        res.redirect('back');
    }
}