const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
content:{type: String,required: true, maxlength: 500},
content:{type: Number,required: true, min: 1, max: 5},
content:{type: String,required: true},
content:{type: Date, default: Date.now},
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
