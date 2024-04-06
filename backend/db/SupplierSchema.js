const mongoose = require('mongoose');
const SupplierSch = new mongoose.Schema({
    name:String
});

module.exports = mongoose.model('supplier',SupplierSch);
