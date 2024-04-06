const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    type:Number
});

module.exports = mongoose.model("account",UserSchema);
