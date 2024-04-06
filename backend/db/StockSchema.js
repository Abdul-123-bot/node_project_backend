const mongoose = require('mongoose');
const StockSch = new mongoose.Schema({
    product:String,
    quantity:Number,
    updatedAt:Date,
    createdAt:Date,
    warehouseId: Number
});

module.exports = mongoose.model('stock',StockSch);
