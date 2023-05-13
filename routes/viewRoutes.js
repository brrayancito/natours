const express = require('express');

const viewsController = require('../controllers/viewsController.js');

const router = express.Router();

//Routes
router.get('/', viewsController.getOverview);
router.get('/tour', viewsController.getTour);

module.exports = router;
