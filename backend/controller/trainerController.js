import Programme from '../model/programmeModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';

export const getTrainerDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    if (user.role !== 'trainer' && user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    const trainerId = req.query.trainerId; // Assuming trainerId is passed as a query parameter
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer Not Found' });
    }

    res.status(200).json({ message: 'Trainer', trainer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllTrainer = async (req, res) => {
  try {
    // Fetch all trainers and populate the user field with additional fields
    const trainers = await Trainer.find()
      .populate('user', 'name email profilePhoto') // Include profilePhoto
      .exec();

    res
      .status(200)
      .json({ message: 'Trainers fetched successfully', trainers });
  } catch (err) {
    console.error('Error:', err);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  }
};

export const deleteTrainer = async (req, res) => {
  const id = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    if (user.role !== 'trainer' && user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    const trainerId = req.query.trainerId; // Assuming trainerId is passed as a query parameter
    const trainer = await Trainer.findByIdAndDelete(trainerId);

    user.role = 'trainer';
    console.log(user.role);
    await user.save();

    res.status(200).json({ message: 'Deleted Successfully', user });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTrainer = async (req, res) => {
  const trainerId = req.params.trainerId; // Assuming trainerId is passed as a parameter

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer Not Found' });
    }

    // Update the trainer's fields based on what's provided in the request body
    if (req.body.socialMediaLink) {
      trainer.socialMediaLink = req.body.socialMediaLink;
    }
    if (req.body.description) {
      trainer.description = req.body.description;
    }

    // Save the updated trainer object
    const updatedTrainer = await trainer.save();

    res.status(200).json({
      message: 'Trainer updated successfully',
      trainer: updatedTrainer,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createTrainerDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    if (user.role !== 'trainer') {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    // Check if there is an existing trainer for this user
    let trainer = await Trainer.findOne({ user: user._id });

    if (!trainer) {
      // If trainer does not exist, create a new trainer
      trainer = new Trainer({
        user: user._id,
      });
    }

    // Save the trainer (new or existing)
    const savedTrainer = await trainer.save();

    res
      .status(200)
      .json({ message: 'Trainer saved successfully', trainer: savedTrainer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
