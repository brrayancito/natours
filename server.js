const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//Connecting to MongoDB Atlas DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection successful!'));

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

const testTour = new Tour({
  name: 'The Ride',
  price: 415,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('ERROR 🔥:', err));

//-------------START THE SERVER ⚪
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
