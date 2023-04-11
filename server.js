const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//Connecting DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection successful!'));

// console.log(process.env);
// console.log(app.get('env'));

//-------------START THE SERVER ⚪
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
