const mongoose = require('mongoose');

//Creating a Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 3.5,
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price'],
  },
});

//Creating a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
