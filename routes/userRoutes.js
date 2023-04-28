const express = require('express');

const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

//----------------- User Routes 🟨
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//Exporting...
module.exports = router;
