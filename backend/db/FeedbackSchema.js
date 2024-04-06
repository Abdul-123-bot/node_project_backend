const mongoose= require('mongoose');
const FeedbackSch = new mongoose.Schema({
    userId: String,
    productId : String,
    feedback : String
});

module.exports = mongoose.model('feedbacks',FeedbackSch);