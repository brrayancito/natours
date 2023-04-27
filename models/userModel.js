const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'A User must have a password'],
    minLength: 8,
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//MIDDLEWARE
//-------------------------
userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hast the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

//------------------------
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

//METHODS
//-----------------------------------------------------
//PASSWORD VERIFICATION
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//-----------------------------------------------------
//CHECK IF USER CHANGED PASSWORD AFTER JWT ISSUED
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

//-----------------------------------------------------
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
