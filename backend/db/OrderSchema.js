const mongoose = require('mongoose');
const OrderSch = new mongoose.Schema({
    productorder:[String],
    customerId:String,
    total:Number
});

module.exports = mongoose.model('order',OrderSch);
