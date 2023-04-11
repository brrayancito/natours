const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//Check ID
exports.checkID = (req, res, next, value) => {
  console.log(`Tour id is: ${value}`);

  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

//Check req.body
exports.checkReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
//----------------------- Get all tours 🟨
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

// ---------------------------Get Tour 🟨
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// -----------------------Create Tour 🟨
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('Done');
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
