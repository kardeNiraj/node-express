const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const randombytes = require('randombytes');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(function (db) {
    console.log('db connected');
  })
  .catch(function (err) {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    minLength: 8,
    validate: function () {
      return this.confirmPassword == this.password;
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'hotelowner'],
    default: 'user',
  },
  profileImage: {
    type: String,
    default: 'img/users/default.jpeg',
  },
  resetToken: String,
});

// functions on schema
userSchema.methods.createResetToken = function () {
  const resetToken = randombytes(32).toString();
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
};

// hooks in mongoose
// hooks are applied on schemas and not on models
// the pre hooks will run prior to the post hooks (always).

// before
// userSchema.pre('save', function () {
//   console.log('before save', this); // this is used here to access data that is to be saved in database
// });

// after
// userSchema.post('save', function (doc) {
//   console.log('after save', doc);
// });

userSchema.pre('save', function () {
  this.confirmPassword = undefined;
});

// HASHING PASSWORD
// userSchema.pre('save', async function () {
//   const salt = await bcrypt.genSalt();
//   const hashedPass = await bcrypt.hash(this.password, salt);
//   this.password = hashedPass;
// });

// function to add data through code
// (async function createUser() {
//   let user = {
//     name: 'Random',
//     email: 'yoho@gmail.com',
//     password: '01010101',
//     confirmPassword: '01010101',
//   };

//   let data = await userModel.create(user);
//   console.log(data);
// })();

// model
const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;
