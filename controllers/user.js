const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;
const UNAUTHORIZED = require('../constatns').UNAUTHORIZED;
const OK = require('../constatns').OK;
const BADRQST = require('../constatns').BADRQST;

//= =======================================
// User Routes
//= =======================================
exports.getUsers = function (req, res, next) {
    const allUsers = [];
    User.find({}).toArray((err, users => {
        return res.status(OK).json({ users: allUsers });
    }));
};
exports.getOnlineUsers = function (req, res, next) {
    const onlineUsers = [];
    User.find({ status: true }).toArray((err, users => {
        return res.status(OK).json({ users: onlineUsers });
    }));
};
exports.viewProfile = function (req, res, next) {
    const userId = req.params.userId;

    if (req.user._id.toString() !== userId) return res.status(UNAUTHORIZED).json({ error: 'You are not authorized to view this user profile.' });
    User.findById(userId, (err, user) => {
        if (err) {
            res.status(BADRQST).json({ error: 'No user could be found for this ID.' });
            return next(err);
        }

        const userToReturn = setUserInfo(user);

        return res.status(OK).json({ user: userToReturn });
    });
};
