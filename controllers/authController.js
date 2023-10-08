const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { mail } = require('../utils/nodemailer');

require('dotenv').config();

// signup function
module.exports.signup = async function signup(req, res) {
  try {
    const dataObj = req.body;
    const user = await userModel.create(dataObj);
    if (user) {
      mail('signup', user);
      res.json({
        message: 'data received successfully',
        data: user,
      });
    } else {
      res.json({ message: 'error while signup' });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

// login function
module.exports.login = async function login(req, res) {
  try {
    const data = req.body;
    if (data.email) {
      const user = await userModel.findOne({ email: data.email });
      if (user) {
        // becrypt -> compare
        if (user.password == data.password) {
          const uid = user['_id'];
          const token = jwt.sign({ payload: uid }, process.env.JWT_KEY);
          res.cookie('login', token, { httpOnly: true });
          return res.json({ message: 'User Logged in!', data: user });
        } else {
          return res.json({ message: 'Wrong Credentials!' });
        }
      } else {
        return res.json({ message: 'User not found!' });
      }
    } else {
      return res.json({ message: 'Empty field found!' });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// isAuthorized
module.exports.isAuthorized = function isAuthorized(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role)) {
      next();
    } else {
      res.status(401).json({ message: 'operation not allowed' });
    }
  };
};

// protect route
module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      token = req.cookies.login;
      const payload = jwt.verify(token, process.env.JWT_KEY);
      if (payload) {
        const user = await userModel.findById({ _id: payload.payload });
        req.role = user.role;
        req.id = user.id;
        next();
      } else {
        return res.json({ message: 'user is not verified' });
      }
    } else {
      const client = req.get('User-Agent');
      if (client.includes('Mozilla')) {
        res.redirect('/login');
      } else return res.json({ message: 'please login' });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// forget password function
module.exports.forgetPassword = async function forgetPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      console.log(req);
      // to implemet the createResetToken function
      const resetToken = user.createResetToken();
      const resetPasswordLink = `${req.protocol}://${req.get(
        'host'
      )}/resetPassword/${resetToken}`;
      // send mail to user via nodemailer
      mail('resetPassword', {
        resetPasswordLink: resetPasswordLink,
        email: email,
      });
    } else res.json({ message: 'no such user found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// reset pasword function
module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    const { password, confirmPassword } = req.body;
    const token = req.params.token;
    const user = userModel.findOne({ resetToken: token });
    user.resetPasswordHandler(password, confirmPassword);
    await user.save();
    res.json({ message: 'password updated successfuly' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.logout = function logout(req, res) {
  res.cookie('login', '', { maxAge: 1 });
  res.json({ message: 'user logged out' });
};
