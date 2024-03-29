const express = require('express')
const router = express.Router();

const { getProductById, createProduct, getProduct, photo, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product")
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")

// params
router.param("productId", getProductById)
router.param("userId", getUserById)

// routes
// create route
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)
// listing route
router.get("/products", getAllProducts);
// read route
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo);
// update route
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)
// delete route
router.delete("/product/:ProductId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)



router.get("/products/categories", getAllUniqueCategories)


module.exports = router;