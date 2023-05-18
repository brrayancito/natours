const AppError = require('../utils/appError.js');

//---------------------------------------
const handledCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

//---------------------------------------
const handledDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//---------------------------------------
const handledValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

//----------------------------------------
const handledJWTError = () => new AppError('Invalid Token. Please log in again!', 401);
const handledJWTExpiredError = () =>
  new AppError('Invalid Token has expired. Please log in again!', 401);

//---------------------------------------
const sendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  console.error('ERROR🔥', err);
  //B) RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    //1) Log error
    console.error('ERROR🔥', err);

    //2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }

  //B) RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  //1) Log error
  console.error('ERROR🔥', err);

  //2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later!',
  });
};

//------------------------------------------------
//Error Middleware
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    // let error = {...err,};
    if (error.name === 'CastError') error = handledCastErrorDB(error);
    if (error.code === 11000) error = handledDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handledValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handledJWTError();
    if (error.name === 'TokenExpiredError') error = handledJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
