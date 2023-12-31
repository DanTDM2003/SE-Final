module.exports = (req, res, next) => {
    if (req.isUnauthenticated()) {
        return res.redirect('back');
    }

    if (req.user.Role !== "Restaurant") {
        return res.redirect('back');
    }

    next();
}