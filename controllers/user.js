const User = require('../models/user')

// param
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "NO user found in database..."
            })
        }
        req.profile = user
        next();
    })
}
// TODO: GET LIST OF ALL USERS (for lerning how to iport all)
exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: "NO users found in database..."
            })
        }
        res.json(users);
    })
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, userFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "you are not authorised to update this user"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user)
        }
    )
}

exports.getUser = (req, res) => {
    // TODO: get back here for password

    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}