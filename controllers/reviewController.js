const Review = require('../models/reviewModel.js');

const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
