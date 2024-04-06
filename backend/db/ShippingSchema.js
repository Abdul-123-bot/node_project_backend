const mongoose = require('mongoose');
const ShippingSch = new mongoose.Schema({
    shipper_id:String,
    orderId:Number,
    carrier:String,
    status:String,
    deliveryTime:Date
});

module.exports = mongoose.model('shipping',ShippingSch);
