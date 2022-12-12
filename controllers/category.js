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