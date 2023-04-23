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

//---------------------------------------
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unkown error: don't leak error details
  } else {
    //1) Log error
    console.error('ERROR🔥', err);

    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

//------------------------------------------------
//Error Middleware
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    // let error = {...err,};
    if (error.name === 'CastError') error = handledCastErrorDB(error);
    if (error.code === 11000) error = handledDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handledValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
