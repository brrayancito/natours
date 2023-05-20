const multer = require('multer');

const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const factory = require('./handlerFactory.js');

//MULTER CONFIGURATIONS
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img/users');
  },
  filename: (req, file, callback) => {
    //user-454353dd45rfgf4564-235465445.jpeg
    const ext = file.mimetype.split('/')[1];
    callback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    //              user-2487dsa54sdshg-2254544565555.jpeg
  },
});

const multerFilter = (req, file, cb) => {
  //If file is not an image, run an ERROR
  if (!file.mimetype.startsWith('image')) {
    return cb(new AppError('Not an image! Please upload only images.', 404), false);
  }

  //If file is an image, continue
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'public/img/users' });

//
exports.uploadUserPhoto = upload.single('photo');

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
  console.log(req.file);
  console.log(req.body);

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
