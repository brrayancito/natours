const express = require('express');

const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');
const reviewRouter = require('./reviewRoutes.js');

const router = express.Router();

//----------------- User Routes 🟨
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Nested Routes with Express (users routes and review routes)
router.use('/:userId/reviews', reviewRouter);

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//Exporting...
module.exports = router;
