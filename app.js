const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();
app.use(express.json());

//Static files
app.use(express.static(`${__dirname}/public`));

// ------------------------- Middlewares 🟨
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//-------------Routes 🟨
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
