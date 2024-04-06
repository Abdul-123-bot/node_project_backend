const mongoose = require('mongoose');
const ShipperSch = new mongoose.Schema({
    name: String,
    address_id : String
})

module.exports = mongoose.model('shipper',ShipperSch);