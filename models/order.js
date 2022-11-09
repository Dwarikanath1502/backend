/* CREATING BOTH productInCartSchema and orderSchema HERE IN THE SAME FILE... */
const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose.Schema;

const ProductCartSchema = new Schema({
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
const orderSchema = new Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: { type: String },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart }