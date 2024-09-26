import mongoose from 'mongoose';

// Define the Review schema as a subdocument
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
    minlength: 1,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the Trainer schema
const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  socialMediaLink: {
    facebook: {
      type: String,
      validate: {
        validator: function (v) {
          return v === '' || /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
    instagram: {
      type: String,
      validate: {
        validator: function (v) {
          return v === '' || /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
    linkedin: {
      type: String,
      validate: {
        validator: function (v) {
          return v === '' || /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
  },
  description: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Description',
  },
  programmes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programme',
    },
  ],
  trainerReviews: [reviewSchema],

  // Required fields for Stripe account registration
  stripeAccountId: {
    type: String,
    required: true,
  },
  stripeAccountLinked: {
    type: Boolean,
    default: false,
  },
  // Additional fields for Stripe onboarding can be added here
});

// Create and export the Trainer model
const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
