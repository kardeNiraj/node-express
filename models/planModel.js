const mongoose = require('mongoose');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(function (db) {
    console.log('plan db connected');
  })
  .catch(function (err) {
    console.log(err);
  });

const planSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: [20, 'plan name should be less than 20 characters'],
  },
  price: {
    type: Number,
    required: [true, 'price of the plan is required'],
  },
  discount: {
    type: Number,
    required: [true, 'discount should be less than 100%'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'duration of the plan is required'],
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
});

// model
const planModel = mongoose.model('planModel', planSchema);
module.exports = planModel;

// check by adding data to db using the following code
// (async function createPlan() {
//   try {
//     let plan = {
//       name: 'SuperSaver',
//       duration: 30,
//       price: 1000,
//       ratingsAverage: 5,
//       discount: 20,
//     };

//     const data = await planModel.create(plan);
//     console.log(data);
//   } catch (err) {
//     console.log(err.message);
//   }
// })();
