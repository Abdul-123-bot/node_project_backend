const mongoose = require('mongoose');
const SupplyingSch = new mongoose.Schema({
    supplierId:String,
    product:String,
    orderedAt:Date,
    arrivedAt:Date,
    arrived: Boolean
});

module.exports = mongoose.model('supplying',SupplyingSch);
