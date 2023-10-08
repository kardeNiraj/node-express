const mongoose = require('mongoose');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(function (db) {
    console.log('review db connected');
  })
  .catch(function (err) {
    console.log(err);
  });

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'rating should be entered'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'userModel',
    required: [true, 'review must belong to a user'],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'planModel',
    required: [true, 'review must belong to a plan'],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImage',
  }).populate('plan');
  next();
});

const reviewModel = mongoose.model('reviewModel', reviewSchema);

module.exports = reviewModel;
