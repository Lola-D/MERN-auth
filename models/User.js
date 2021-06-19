const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Plese provide a username']
  },
  email: {
    type: String,
    required: [true, 'Plese provide a email'],
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Plese provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// 'this' keyword make reference to current password who is passed in
// middleware executed before saving a user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
  next();
})

// method to check if passwords match
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// method to create token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {id: this._id},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRE}
  )
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest("hex");
    
  this.resetPasswordExpire = Date.now() + 60 * (60 * 1000);
  
  return resetToken;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;