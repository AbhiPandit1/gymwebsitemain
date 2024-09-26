import Review from '../model/reviewModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';

export const createReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rating, reviewText, trainerId } = req.body;

    // Validate if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new review
    const newReview = new Review({
      rating,
      reviewText,
      user: userId,
      // Add trainerId only if provided
      ...(trainerId && { trainer: trainerId }),
    });

    // If trainerId is provided, validate the trainer and associate the review
    if (trainerId) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }

      // Push the review ID into the trainer's reviews
      trainer.trainerReviews.push(newReview._id);
      await trainer.save(); // Save the updated trainer document
    }

    // Save the review document
    await newReview.save();

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params; // Extract reviewId from URL parameters
    const { rating, reviewText } = req.body; // Extract rating and reviewText from request body

    // Find the review by reviewId
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update review fields
    review.rating = rating;
    review.reviewText = reviewText;
    await review.save(); // Save the updated review

    // Send response with updated review
    res.status(200).json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    console.error('Error updating review:', error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { trainerId } = req.body;

    // Find and delete the review
    const review = await Review.findOneAndDelete({
      user: userId,
      trainer: trainerId,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // If a trainerId exists, find the trainer and remove the review ID from their reviews
    if (trainerId) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }

      // Remove the review ID from the trainer's reviews array
      trainer.trainerReviews = trainer.trainerReviews.filter(
        (reviewId) => !reviewId.equals(review._id)
      );

      // Save the updated trainer document
      await trainer.save();
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'name email profilePhoto _id',
      })
      .populate({
        path: 'trainer',
        select: 'name',
      });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsOfSingleTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body; // trainerId from req.body

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
