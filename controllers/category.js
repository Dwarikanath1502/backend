const Category = require('../models/category')


exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            res.status(400).json({
                error: "Category not found..."
            })
        }
        req.category = category;
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
        if (err || !categories) {
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

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                err: "Failed to update category..."
            })
        }
        res.json(updatedCategory);
    })

}

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            res.status(400).json({
                err: "Failed to delete the category"
            })
        }
        res.json({
            message: `Sucessfully deleted! ${category}`
        })
    })
}