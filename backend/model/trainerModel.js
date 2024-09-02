import mongoose from 'mongoose';

// Define the Description schema as a subdocument
const descriptionSchema = new mongoose.Schema({
  paragraphs: [
    {
      type: String,
      required: true,
    },
  ],
  image: {
    type: String,
    default: '',
  },
});

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
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
    instagram: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
    linkedin: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
  },
  description: {
    type: descriptionSchema,
    required: true,
  },
  programmes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programme',
    },
  ],
  trainerReviews: [reviewSchema],
});

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
