const express = require('express');

const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');
const reviewRouter = require('./reviewRoutes.js');

const router = express.Router();

//----------------- User Routes 🟨
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protect routes (need to be login) after this point or middleware ⬇
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMyPassword', authController.updatePassword);

//Nested Routes with Express (users routes and review routes)
router.use('/:userId/reviews', reviewRouter);

//Protect routes (need to be login and be admin) after this point or middleware ⬇
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//Exporting...
module.exports = router;
