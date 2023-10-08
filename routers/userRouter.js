const express = require('express');
const multer = require('multer');

const {
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
  updateProfileImage,
} = require('../controllers/userController');
const {
  login,
  logout,
  signup,
  protectRoute,
  isAuthorized,
  forgetPassword,
  resetPassword,
} = require('../controllers/authController');

const userRouter = express.Router();

// user options
userRouter.route('/:id').patch(updateUser).delete(deleteUser);

// login
userRouter.route('/login').post(login);

// logout
userRouter.route('/logout').get(logout);

// signup
userRouter.route('/signup').post(signup);

// forget password
userRouter.route('/forgetPassword').post(forgetPassword);
userRouter.route('/resetPassword/:token').post(resetPassword);

// multer for image upload
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}.jpeg`);
  },
});

const filter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an Image! Please upload an image'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filter,
});

userRouter.get('/profileImage', (req, res) => {
  res.sendFile('D:/backend/views/imageUpload.html');
});

userRouter.post('/profileImage', upload.single('photo'), updateProfileImage);

// profile page
userRouter.use(protectRoute);
userRouter.route('/userProfile').get(getUser);

// admin user functions
userRouter.use(isAuthorized(['admin']));
userRouter.route('').get(getAllUser);

module.exports = userRouter;
