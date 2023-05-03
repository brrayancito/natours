const express = require('express');

const authController = require('../controllers/authController.js');
const tourController = require('../controllers/tourController.js');
const reviewController = require('../controllers/reviewController.js');

const router = express.Router();

//----------------- Tour Routes 🟨
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// POST /tour/23534-tour-ID-55354445/reviews
// GET /tour/2353455354445/reviews
// GET /tour/235345-tourID-5354445/reviews/dfdkdk-reviewID-dfdfdfd

router
  .route('/:tourId/reviews')
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

//Exporting...
module.exports = router;
