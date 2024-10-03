import sendEmail from '../lib/sendEmail.js';
import Review from '../model/reviewModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';

export const changeEmail = async (req, res) => {
  const id = req.params.id;
  const { oldEmail, newEmail } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the old email matches the user's current email
    if (user.email !== oldEmail) {
      return res.status(400).json({ error: 'Old email does not match' });
    }

    // Validate the new email format
    if (!newEmail || !newEmail.includes('@')) {
      return res.status(400).json({ error: 'Invalid new email address' });
    }

    // Check if the new email is already in use
    // Find any existing user with the new email address
    const existingUser = await User.findOne({ email: newEmail });

    if (existingUser && existingUser._id.toString() !== id) {
      return res
        .status(400)
        .json({ error: 'New email is already in use by another user' });
    }

    // Update the user's email
    user.email = newEmail;

    // Save the updated user record
    await user.save();

    // Respond with success
    res.status(200).json({ message: 'Email updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saltRounds = 10; // Number of salt rounds for bcrypt

export const changePassword = async (req, res) => {
  const id = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // Validate the new password (you can add more complex validations)
    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: 'New password must be at least 8 characters long' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user record
    await user.save();

    // Respond with success
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const changeSocialMedia = async (req, res) => {
  const userId = req.params.id; // ID of the user (or trainer)
  const { facebook, instagram, linkedin } = req.body; // Extract social media links from request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is a trainer
    if (user.role !== 'trainer') {
      return res
        .status(404)
        .json({ error: 'Trainer not found for the given user ID' });
    }

    // Find the trainer by user ID
    let trainer = await Trainer.findOne({ user: userId });

    if (!trainer) {
      // Create a new Trainer record if it doesn't exist
      trainer = new Trainer({
        user: userId,
        socialMediaLink: {
          facebook,
          instagram,
          linkedin,
        },
      });
    } else {
      // Update the social media links if the Trainer record exists
      trainer.socialMediaLink = {
        facebook,
        instagram,
        linkedin,
      };
    }

    // Save the trainer record
    await trainer.save();

    // Respond with success
    res
      .status(200)
      .json({ message: 'Social media links updated successfully', trainer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const complain = async (req, res) => {
  const userId = req.params.id; // ID of the user making the complaint
  const { complaintText } = req.body; // The text of the complaint

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the complaint text
    if (!complaintText || complaintText.trim().length === 0) {
      return res.status(400).json({ error: 'Complaint text cannot be empty' });
    }

    // Construct the email message
    const subject = 'New Complaint Received';
    const message = `
        User ID: ${userId}
        User Email: ${user.email}
        Complaint:
        ${complaintText}
      `;

    // Send the email to the company's email address
    await sendEmail({
      email: process.env.COMPANY_EMAIL, // Company email address from environment variables
      subject,
      message,
      emailType: 'user_complain',
    });

    // Respond with success
    res.status(200).json({
      message:
        'Your complaint has been registered. We will contact you within 24 hours.',
    });
  } catch (error) {
    console.error('Error handling complaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const userId = req.params.id; // Assuming the user's ID is provided in the URL parameters

  try {
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!reviewText || reviewText.trim().length === 0) {
      return res.status(400).json({ error: 'Review text cannot be empty' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new review
    const newReview = new Review({
      rating,
      reviewText,
      userName: userId, // Reference to the user who submitted the review
    });

    // Save the review to the database
    await newReview.save();

    // Respond with success
    res
      .status(201)
      .json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
