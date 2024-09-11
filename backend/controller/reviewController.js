import Review from '../model/reviewModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';

export const createReview = async (req, res) => {
  try {
    const { userId, trainerId } = req.params;
    const { rating, reviewText } = req.body;

    // Validate if the user and trainer exist
    const user = await User.findById(userId);
    const trainer = await Trainer.findById(trainerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Create and save the new review
    const newReview = new Review({
      rating,
      reviewText,
      user: userId,
      trainer: trainerId,
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { userId, trainerId } = req.params;
    const { rating, reviewText } = req.body;

    // Find and update the review
    const review = await Review.findOneAndUpdate(
      { user: userId, trainer: trainerId },
      { rating, reviewText },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { userId, trainerId } = req.params;

    // Find and delete the review
    const review = await Review.findOneAndDelete({
      user: userId,
      trainer: trainerId,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReview = async (req, res) => {
  try {
    // Fetch all reviews with populated user and trainer fields
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'name email profilePhoto', // Adjust fields based on your User schema
      })
      .populate({
        path: 'trainer',
        select: 'name', // Adjust fields based on your Trainer schema
      });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewOfSingleTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const reviews = await Review.find({ trainer: trainerId }).populate(
      'user',
      'name'
    );

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: 'No reviews found for this trainer' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
