const express = require('express');
const { protectRoute, isAuthorized } = require('../controllers/authController');

const {
  getAllPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  top3plans,
} = require('../controllers/planController');

const planRouter = express.Router();

// fetch all plans no login is needed
planRouter.route('/allPlans').get(getAllPlans);

// top 3 plans
planRouter.route('/top3').get(top3plans);

// after login
planRouter.use(protectRoute);

// get personal plans
planRouter.route('/:id').get(getPlan);

// only accessible by admin and owner
planRouter.use(isAuthorized(['admin', 'owner']));

// crud on plans
planRouter.route('/crud').post(createPlan);

planRouter.route('/crud/:id').patch(updatePlan).delete(deletePlan);

module.exports = planRouter;
