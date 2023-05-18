const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const sendEmail = require('../utils/email.js');
// const bcrypt = require('bcryptjs');
// const { promisify } = require('util');

//------------------------------------------------------
//SIGN TOKEN
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//-----------------------------------------------------
//Create and send token to client
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  //Remove password from output
  user.password = undefined;

  //Send JWT Token by cokkie
  res.cookie('jwt', token, cookieOptions);

  //Response to the client
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
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

  createSendToken(newUser, 201, res);
});

//--------------------------------------------------------
//LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  // const user = User.findOne({ email: email });
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect E-mail or password', 401));
  }

  //3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

//--------------------------------------------------------
//LOG OUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

//--------------------------------------------------------
//PROTECT ROUTES
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Getting token and check if it's there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

//--------------------------------------------------------
//FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is not user with that email address', 404));

  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });

  //   try {
  //     await sendEmail({
  //       email: user.email,
  //       subject: 'Your password reset token (valid for 10 min)',
  //       message,
  //     });

  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Token sent to email',
  //     });
  //   } catch (err) {
  //     this.passwordResetToken = undefined;
  //     this.passwordResetExpires = undefined;

  //     await user.save({ validateBeforeSave: false });

  //     return next(new AppError('There was an error sending the email. Try again later!', 500));
  //   }
});

//--------------------------------------------------------
//RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3) Update changedPasswordAt property for the user

  //4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

//--------------------------------------------------------
//UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log(req.user);

  //2) Check if POSTed current password correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  //4) Log user in, send JWT
  createSendToken(user, 200, res);
});

//--------------------------------------------------------
//Only for rendered pages, not errors!
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      //3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      //4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user! So, user will be added to res.locals, then pug can access it in the template
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  //
  // If there is not jwt token, then res.locals.user will not create
  next();
};
