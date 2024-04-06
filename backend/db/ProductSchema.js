const mongoose = require('mongoose');
const ProductSch = new mongoose.Schema({
    name:String,
    price:Number,
    brand:String,
    category:String,
    vat: Number,
    quantity:Number,
    description:String,
    user_id:String
});

module.exports = mongoose.model('products',ProductSch);
