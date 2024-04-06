const mongoose = require('mongoose');
const ProductOrderSch = new mongoose.Schema({
    productId:String,
    quantity:Number,
    price:Number,
    vat:Number
});

module.exports = mongoose.model('products_orders',ProductOrderSch);
