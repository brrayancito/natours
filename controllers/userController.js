const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const factory = require('./handlerFactory.js');

//FILTER A OBJECT
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//---------------------------- Update Me 🟨
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create a error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for passwords updates. Please use /updateMyPassword', 400)
    );
  }
  //Filtered out unwanted fields names that are not allow to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  //3) Send Data
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

//---------------------------- Delete Me 🟨
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

//------ Set Current User ID to params.id 🟨
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//------------------------ Get All Users 🟨
exports.getAllUsers = factory.getAll(User);

//------------------------------ Get User 🟨
exports.getUser = factory.getOne(User);

//--------------------------- Create User 🟨
//Already have the SignUp

//--------------------------- Update User 🟨
//Do NOT update password with this!
exports.updateUser = factory.updateOne(User);

//---------------------------- Delete User🟨
exports.deleteUser = factory.deleteOne(User);
