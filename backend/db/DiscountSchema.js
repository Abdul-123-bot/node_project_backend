const mongoose = require('mongoose');
const DiscountSch = new mongoose.Schema({
    name:String,
    percentage:Number,
    start:Date,
    end:Date
});

module.exports = mongoose.model('discount',DiscountSch);
