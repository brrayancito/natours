const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

//------------------------ Get All Users 🟨
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: User.length,
    data: {
      users,
    },
  });
});

//------------------------------ Get User 🟨
exports.getUser = (req, res) => {};

//--------------------------- Create User 🟨
exports.createUser = (req, res) => {};

//--------------------------- Update User 🟨
exports.updateUser = (req, res) => {};

//---------------------------- Delete User🟨
exports.deleteUser = (req, res) => {};
