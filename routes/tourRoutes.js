const express = require('express');

const tourController = require('../controllers/tourController.js');

const router = express.Router();

//----------------- Tour Routes 🟨
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//Exporting...
module.exports = router;
