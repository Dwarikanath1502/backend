const express = require('express')
const router = express.Router()
const { check } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require('../controllers/auth')

router.post("/signup", [
    check("name")
        .isLength({ min: 3 })
        .withMessage('Name should be at least 3 chars long'),
    check("email")
        .isEmail()
        .withMessage('Email is required'),
    check("password")
        .isLength({ min: 5 })
        .withMessage('It should atleast 5 char long'),
], signup)

router.post("/signin", [
    check("email")
        .isEmail()
        .withMessage('Email is required'),
    check("password")
        .isLength({ min: 1 })
        .withMessage('Password field is reequired'),
], signin)

// router.get("/testroute",isSignedIn, (req, res)=> {
//     res.json(req.auth)
// })

router.get("/signout", signout)



module.exports = router;