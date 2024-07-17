import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [20, 'Name cannot be more than 20 characters'],
    minLength: [4, 'Name should be at least 4 characters long'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format',
    },
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'trainer'],
    default: 'user',
  },
  profilePhoto: {
    public_id: { type: String }, // Add these fields to store Cloudinary data
    url: { type: String },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hasTakenProgramme: {
    type: Boolean,
    default: false,
  },
  takenProgrammes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programme',
    },
  ],
  paymentIntents: [
    {
      type: String,
    },
  ],
  tokens: [
    {
      type: String,
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.methods.getResetToken = function () {
  // Generate a token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set the token expiration time to 1 hour from now
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 1 hour in milliseconds

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
