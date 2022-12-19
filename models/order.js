/* CREATING BOTH productInCartSchema and orderSchema HERE IN THE SAME FILE... */
const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose.Schema;

const ProductCartSchema = mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
}, { timestamps: true })
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);


// Order Schema
const orderSchema = mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: { type: String },
    status : {
        type: String, 
        default: "Received", 
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart }