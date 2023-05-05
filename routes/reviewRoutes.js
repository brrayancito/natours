const express = require('express');

const reviewController = require('../controllers/reviewController.js');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourAndUserIds,
    reviewController.createReview
  );

router.route('/:id').patch(reviewController.updateReview).delete(reviewController.deleteReview);

module.exports = router;
