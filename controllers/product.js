const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs") //file system
const router = require("../routes/product")
const product = require("../models/product")


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        // .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product not found"
                })
            }
            req.product = product;
            next();
        })
}

// TODO:  CHECK VALIDATIONS ON PRODUCT
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                err: "problem with product image..."
            })
        }
        // destructure the fields
        const { name, description, price, category, stock } = fields;
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                err: "please include all fields"
            })
        }


        let product = new Product(fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 300000) {
                return res.status(400).json({
                    err: "File size is too big, it should be under 3mb"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        console.log(product);
        // save to db
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    err: "Product not saved"
                })
            }
            res.json(product)
        })

    })
}

exports.getProduct = (req, res) => {
    // we may remove undefined portion too, but it will not good for performance  
    req.product.photo = undefined //it may have heavy sizze which may create delay
    return res.json(req.product);
}

// it will load photo in background
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }
    next();
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                err: "problem with product image..."
            })
        }
        //    updation code
        let product = req.product;
        // it will load all the data from db in form
        product = _.extend(product, fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 300000) {
                return res.status(400).json({
                    err: "File size is too big, it should be under 3mb"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // console.log(product);
        // save to db
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    err: "Product updation failed"
                })
            }
            res.json(product)
        })

    })
}


exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            res.status(400).json({
                err: "Failed to delete the product"
            })
        }
        res.json({
            message: "Product deleted successfully...",
            deletedProduct
        })
    })
}


exports.getAllProducts = (req, res) => {
    // query is processed in string fomat so parseInt
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"


    Product.find()
        .select("-photo") //- menas don't select
        .sort([[sortBy, "asc"]])
        .populate("Category")
        .limit(limit) //if user not pass val then only 8 element will be displyed
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    err: "Unable to fetch all the products"
                })
            }
            res.json(products)
        })
}

exports.getAllUniqueCategories = (req, res) => {
    // distinct gives all the unique value
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                err: "NO category found..."
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count } }
            }
        }


    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                err: "Bulk operation failed"
            })
        }
        next();
    })

}

