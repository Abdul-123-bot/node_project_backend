const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
    city: String,
    state: String,
    street: String,
    hno: Number,
    user : String,
    type : String
})

module.exports= mongoose.model('address',AddressSchema);