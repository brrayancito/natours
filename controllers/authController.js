const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

//------------------------------------------------------
//SIGN TOKEN
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//---------------------------------------------------
//SIGN UP
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

//--------------------------------------------------------
//LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  //2) Check if email and password exist
  //   const user = User.findOne({ email: email });
  const user = await User.findOne({ email }).select('+password');
  //   const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect E-mail or password', 401));
  }

  //3) If everything ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

//--------------------------------------------------------
//PROTECT
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Getting token and check if it's there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('You are not logged in! Please log in to get access.', 401));

  //2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('The user belonging to this token does no longer exist.', 401));

  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed passsword! Log in again', 401));
  }

  //GRAND ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//--------------------------------------------------------
//RESTRICT TO
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //Roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
