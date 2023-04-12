const { json } = require('express');
const Tour = require('../models/tourModel.js');

//----------------------- Get all tours 🟨
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

// ---------------------------Get Tour 🟨
exports.getTour = (req, res) => {
  console.log(req.params);

  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

// -----------------------Create Tour 🟨
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

//------------------------ Update Tour 🟨
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated your here...',
    },
  });
};

//------------------------ Delete Tour 🟨
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
