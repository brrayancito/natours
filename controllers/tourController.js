const Tour = require('../models/tourModel.js');

//----------------------- Get all tours 🟨
exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    //1.A) Filtering
    const queryObject = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    //1.B) Advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(req.query); // { difficulty: 'easy', duration: { gte: '4' } }
    console.log(JSON.parse(queryStr)); // { difficulty: 'easy', duration: { '$gte': '4' } }

    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('price');
    }

    //EXECURE QUERY
    const tours = await query;

    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// ---------------------------Get Tour 🟨
exports.getTour = async (req, res) => {
  try {
    // const tour = await Tour.findOne({ _id: req.params.id });
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
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
      message: err,
    });
  }
};

//------------------------ Update Tour 🟨
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

//------------------------ Delete Tour 🟨
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
