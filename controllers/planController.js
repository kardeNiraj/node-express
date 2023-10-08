const planModel = require('../models/planModel');

module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    const plans = await planModel.find();
    if (plans) {
      res.json({ message: 'plans retreived', data: plans });
    } else res.json({ message: 'no plans found' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  try {
    const id = req.params.id;
    const plan = await planModel.findById(id);
    if (plan) {
      res.json({ message: 'plan retreived', data: plan });
    } else res.json({ message: 'no such plan found' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  try {
    const planData = req.body;
    const data = await planModel.create(planData);
    res.json({ message: 'plan created successfuly', data: data });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    const id = req.params.id;
    const plan = await planModel.findById(id);
    if (plan) {
      const newData = req.body;
      let keys = [];
      for (let key in newData) {
        keys.push(key);
      }
      for (let key of keys) {
        plan[key] = newData[key];
      }
      await plan.save();
      res.json({ message: 'plan updated successfully', data: plan });
    } else res.json({ message: 'no such plan found' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    const id = req.params.id;
    const plan = await planModel.findByIdAndDelete(id);
    if (plan) {
      res.json({ message: 'plan deleted', data: plan });
    } else res.json({ message: 'no plan existed' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.top3plans = async function top3plans(req, res) {
  try {
    const plans = await planModel.find().sort({ ratingsAverage: -1 }).limit(3);
    res.json({ message: 'top 3 plans', data: plans });
  } catch (err) {
    res.json({ message: err.message });
  }
};
