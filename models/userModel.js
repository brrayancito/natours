const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A User must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid E-mail'],
    trim: true,
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'A User must have a password'],
    minLength: 8,
    trim: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
