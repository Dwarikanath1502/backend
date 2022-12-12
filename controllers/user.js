const User = require('../models/user')
const Order = require('../models/order')

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
        { new: true, us5eFindAndModify: false },
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

exports.userPurchaseList = (req, res) => {
    Order.find({
        user: req.profile._id
    })
        // populate helps to reference document in other collection
        .populate("user", "_id name") //this is populate synatx no comma there
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No order in this account"
                })
            }
            return res.json(order);
        })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })
    //  store this in db
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next();
        }
    )
}