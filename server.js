const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({ path: './config.env' });

// console.log(process.env);
// console.log(app.get('env'));

//-------------START THE SERVER ⚪
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
