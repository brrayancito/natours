const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

// console.log(process.env);
// console.log(app.get('env'));

//-------------START THE SERVER ⚪
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
