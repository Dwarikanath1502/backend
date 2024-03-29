const User = require('../models/user')
const { check, validationResult } = require('express-validator');
var jwtwebToken = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");


exports.signup = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            error: errors.array()[0].param
        })
    }
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user to DB..."
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
    // console.log("REQ BODY", req.body);
    // res.json({
    //     message: "sign up route works!"
    // })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body; //  destructuring

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            error: errors.array()[0].param
        })
    }
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "User doesn't exists..."
            })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "email and pass do not match..."
            })
        }
        // create token
        const token = jwtwebToken.sign({ _id: user._id }, process.env.SECRET);

        // put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        // send response to frontend
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: { _id, name, email, role }
        })
    })

}

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User signout Successfully..."
    });
}


// PROTECTED ROUTES
exports.isSignedIn = jwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ["HS256"]
})


//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};


exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not ADMIN, Access denied!"
        })
    }
    next();
}