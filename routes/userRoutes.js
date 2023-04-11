const express = require('express');

const userController = require('../controllers/userController.js');

const router = express.Router();

//----------------- User Routes 🟨
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//Exporting...
module.exports = router;
