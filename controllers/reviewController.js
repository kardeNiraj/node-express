const planModel = require('../models/planModel');
const reviewModel = require('../models/reviewModel');

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) res.json({ message: 'all reviews', data: reviews });
    else res.json({ message: 'no reviews' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getReview = async function getReview(req, res) {
  try {
    const id = req.params.id;
    const review = await reviewModel.findById(id);
    if (review) res.json({ message: 'review found', data: review });
    else res.json({ message: 'no review could be found' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    const planId = req.params.planId;
    let plan = await planModel.findById(planId);
    if (plan) {
      const totalRating = plan.ratingsAverage * plan.totalReviews;
      plan.totalReviews++;
      const newReview = req.body;
      const review = await reviewModel.create(newReview);
      if (review) {
        plan.ratingsAverage = (totalRating + review.rating) / plan.totalReviews;
        await plan.save();
        res.json({ message: 'review added' });
      } else res.json({ message: 'there was some problem posting the review' });
    } else res.json({ message: 'no such plan exists' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  const planId = req.params.planId;
  const id = req.body.id;
  let review = await reviewModel.findById(id);
  if (review) {
    const dataToUpdate = req.body;
    let keys = [];
    for (let key in dataToUpdate) {
      if (key == 'id') continue;
      keys.push(key);
    }
    for (let key of keys) review[key] = dataToUpdate[key];
    await review.save();
    res.json({ message: 'review updated successfully' });
  } else res.json({ message: 'no such review exists' });
};

module.exports.deleteReview = async function deleteReview(req, res) {
  const planId = req.params.planId;
  const id = req.body.id;
  const data = await reviewModel.findByIdAndDelete(id);
  if (data) res.json({ message: 'review deleted successfully' });
  else res.json({ message: 'no such review found' });
};

module.exports.top3reviews = async function top3reviews(req, res) {
  try {
    const reviews = await reviewModel.find().sort({ rating: -1 }).limit(3);
    if (reviews) {
      res.json({ message: 'top 3 reviews retreived', data: reviews });
    } else res.json({ message: 'no reviews found' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  const planId = req.params.planId;
  const reviews = await reviewModel.find({ plan: planId });
  if (reviews) res.json({ message: 'reviews retreived', data: reviews });
  else res.json({ message: 'no review present for the selected plan' });
};
