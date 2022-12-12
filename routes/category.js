const express = require("express")
const router = express.Router()

const { getCategoryById, getCategory,createCategory, getAllCategory, updateCategory, removeCategory } = require('../controllers/category')
const { isAuthenticated, isAdmin, isSignedIn } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

// PARAMS
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)

// ACTUAL ROUTES GOES HERE
// create routr
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)
// read route
router.get("/category/:categoryId", getCategory)
router.get("/category", getAllCategory)

// update route
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

// delete route
router.delete("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, removeCategory )


module.exports = router;