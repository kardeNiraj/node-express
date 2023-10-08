const express = require('express');
const { protectRoute } = require('../controllers/authController');

// controller import
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  top3reviews,
  getPlanReviews,
} = require('../controllers/reviewController');

const reviewRouter = express.Router();

reviewRouter.route('/all').get(getAllReviews);

reviewRouter.route('/top3').get(top3reviews);

reviewRouter.route('/:id').get(getReview);

// all login users can use following functions explicitely
reviewRouter.use(protectRoute);

reviewRouter
  .route('/crud/:planId')
  .post(createReview)
  .patch(updateReview)
  .delete(deleteReview);

reviewRouter.route('/:planId/allReviews').get(getPlanReviews);

module.exports = reviewRouter;
