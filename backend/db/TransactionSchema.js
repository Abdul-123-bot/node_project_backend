const mongoose = require('mongoose');
const TransactionSch = new mongoose.Schema({
    id:Number,
    orderId:Number,
    type:String,
    total:Number
});

module.exports = mongoose.model('transaction',TransactionSch);
