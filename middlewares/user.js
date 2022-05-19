const User = require('../models/user')
const CustomError = require('../utils/CustomError')
const jwt = require('jsonwebtoken')

exports.isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new CustomError("Login before accessing this page!", 400))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next();
}

exports.customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomError("You are not allowed for this resouce", 403));
        }
        next();
    };
};