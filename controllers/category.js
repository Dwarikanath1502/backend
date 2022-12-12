const Category = require('../models/category')


exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            res.status(400).json({
                error: "Cateory not found..."
            })
        }
        res.category = category;
        next();
    })
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            res.status(400).json({
                error: "Category not added to database..."
            })
        }
        res.json({ category })
    })
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err || !category) {
            res.status(400).json({
                error: "No categories found"
            })
        }
        res.json(categories);
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category)
}