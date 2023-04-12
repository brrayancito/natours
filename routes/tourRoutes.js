const express = require('express');

const tourController = require('../controllers/tourController.js');

const router = express.Router();

//----------------- Tour Routes 🟨
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkReqBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//Exporting...
module.exports = router;
