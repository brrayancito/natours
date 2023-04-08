const fs = require('fs');
const express = require('express');

const tourController = require('./../controllers/tourController.js');

//----------------- Tours Routes 🟨
const router = express.Router();

router.param('id', tourController.checkID);

router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//Exporting...
module.exports = router;
