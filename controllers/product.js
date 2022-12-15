const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs") //file system


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

exports.getProduct = (req, res) =>{
    // we may remove undefined portion too, but it will not good foe user experiance
    req.product.photo = undefined //it may have heavy sizze which may create delay
    return res.json(req.product);
}

// it will load photo in background
exports.photo = (req, res, next) =>{
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data);        
    }
    next();
}