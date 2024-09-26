import mongoose from 'mongoose';

// Define the schema for a review
const { Schema } = mongoose;

const reviewSchema = new Schema({
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
    // Reference to the user who wrote the review
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trainer: {
    // Reference to the trainer being reviewed
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Review = mongoose.model('Review', reviewSchema);

export default Review;
