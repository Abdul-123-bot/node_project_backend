const mongoose = require('mongoose');
const ProductSch = new mongoose.Schema({
    name:String,
    price:Number,
    brand:String,
    category:String,
    description: String,
    user_id:String,
    image:
    {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('products',ProductSch);
