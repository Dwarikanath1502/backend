const express = require('express')
const router = express.Router()

const { getUserById, getUser,updateUser, getAllUsers, userPurchaseList } = require('../controllers/user')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')

// middleware
router.param("userId", getUserById)

// route to fetching a single user
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)
// route to update user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

//TODO: get all users(for learning only)
// router.get("/users", getAllUsers)

module.exports = router;      