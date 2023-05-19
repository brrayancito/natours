const Tour = require('../models/tourModel.js');
const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is not tour with that name.', 404));
  }

  // 2) Build templete

  // 2) Render template using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: `Log into your account`,
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `Your account`,
  });
};

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: `Your account`,
    user: updatedUser,
  });
});
