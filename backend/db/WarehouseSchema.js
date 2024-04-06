const mongoose = require('mongoose');
const WarehouseSch = new mongoose.Schema({
    id:Number,
    capacity:Number,
    location:Number
});

module.exports = mongoose.model('warehouse',WarehouseSch);
