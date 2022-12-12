const express = require("express")
const router = express.Router()

const { getCategoryById, getCategory,createCategory, getAllCategory } = require('../controllers/category')
const { isAuthenticated, isAdmin, isSignedIn } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

// PARAMS
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)

// ACTUAL ROUTES GOES HERE
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)
router.get("category/:categoryId", getCategory)
router.get("category", getAllCategory)

module.exports = router;