const fs = require('fs');
const express = require('express');
const { error } = require('console');

const app = express();
app.use(express.json());

const port = 3000;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Get all tours 🟨
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get tour by id 🟨
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  // if (id > tours.length - 1) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Create new tour 🟨
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (error) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
  // res.send('Done');
});

// Update tour 🟨
app.patch('/api/v1/tours/:id', (req, res) => {
  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated your here...',
    },
  });
});

// Delete tour 🟨
app.delete('/api/v1/tours/:id', (req, res) => {
  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });
