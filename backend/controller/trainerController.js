import Programme from '../model/programmeModel.js';
import Description from '../model/descriptionModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';
import { uploadTrainerPhoto } from '../middleware/uploadToCloudinary.js';
import { promisify } from 'util';
import mongoose from 'mongoose';
import fs from 'fs';
import { deleteCloudinaryImage } from '../middleware/deleteCloudinaryImage.js';

// Promisify fs.unlink for async file deletion
const unlinkFile = promisify(fs.unlink);

// Function to fetch trainer details based on trainerId and user authorization
export const getTrainerDetail = async (req, res) => {
  const userId = req.params.id;
  const trainerId = req.query.trainerId;

  try {
    const user = await User.findById(userId);

    if (!user || (user.role !== 'trainer' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer Not Found' });
    }

    res.status(200).json({ message: 'Trainer details fetched', trainer });
  } catch (error) {
    console.error('Error fetching trainer details:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get all trainers and populate user details
export const getAllTrainer = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('user', 'name email profilePhoto _id')
      .exec();
    res
      .status(200)
      .json({ message: 'Trainers fetched successfully', trainers });
  } catch (err) {
    console.error('Error fetching all trainers:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to delete a trainer based on trainerId
export const deleteTrainer = async (req, res) => {
  const userId = req.body.id;
  const trainerId = req.query.trainerId;

  try {
    const user = await User.findById(userId);
    if (!user || (user.role !== 'trainer' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    const trainer = await Trainer.findByIdAndDelete(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer Not Found' });
    }

    user.role = 'trainer';
    await user.save();

    res.status(200).json({ message: 'Trainer deleted successfully', user });
  } catch (error) {
    console.error('Error deleting trainer:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to update trainer details
export const updateTrainer = async (req, res) => {
  const trainerId = req.params.trainerId;

  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer Not Found' });
    }

    // Update fields if provided
    if (req.body.socialMediaLink)
      trainer.socialMediaLink = req.body.socialMediaLink;
    if (req.body.description) trainer.description = req.body.description;

    const updatedTrainer = await trainer.save();
    res.status(200).json({
      message: 'Trainer updated successfully',
      trainer: updatedTrainer,
    });
  } catch (error) {
    console.error('Error updating trainer:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to create trainer details for a specific user
export const createTrainerDetail = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'trainer') {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    let trainer = await Trainer.findOne({ user: user._id });
    if (!trainer) {
      trainer = new Trainer({ user: user._id });
    }

    const savedTrainer = await trainer.save();
    res
      .status(200)
      .json({ message: 'Trainer saved successfully', trainer: savedTrainer });
  } catch (error) {
    console.error('Error creating trainer details:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to handle about trainer updates, including file uploads
export const aboutTrainer = async (req, res) => {
  const userId = req.params.id;
  const { paragraphs } = req.body;

  let filePath = null;

  try {
    const trainer = await Trainer.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    let uploadedImage = null;
    if (req.file) {
      filePath = req.file.path;
      let oldImagePublicId = null;

      if (trainer.description) {
        const existingDescription = await Description.findById(
          trainer.description
        );
        if (existingDescription?.image?.public_id)
          oldImagePublicId = existingDescription.image.public_id;
      }

      try {
        const result = await uploadTrainerPhoto(filePath);
        uploadedImage = { public_id: result.public_id, url: result.secure_url };

        if (oldImagePublicId) await deleteCloudinaryImage(oldImagePublicId);
      } catch (error) {
        return res.status(500).json(
          {
            message: 'Failed to upload image to Cloudinary',
            error: error.message,
          },
          console.log(error)
        );
      }
    }

    const parsedParagraphs = paragraphs
      ? Array.isArray(paragraphs)
        ? paragraphs
        : JSON.parse(paragraphs)
      : [];
    let description = trainer.description
      ? await Description.findById(trainer.description)
      : null;

    if (description) {
      description.paragraphs = parsedParagraphs;
      description.image = uploadedImage || description.image;
      await description.save();
    } else {
      description = new Description({
        paragraphs: parsedParagraphs,
        image: uploadedImage || { public_id: '', url: '' },
      });
      await description.save();
      trainer.description = description._id;
      await trainer.save();
    }

    res.status(200).json({
      message: 'Description processed successfully',
      trainer,
      description,
    });
    console.log(description);
  } catch (error) {
    console.error('Error processing trainer description:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to get trainer and description details
export const getTrainerDetails = async (req, res) => {
  const trainerId = req.params.trainerId;

  try {
    const trainer = await Trainer.findOne({ user: trainerId });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const description = trainer.description
      ? await Description.findById(trainer.description)
      : null;
    const user = await User.findById(trainer.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ trainer, description, user });
  } catch (error) {
    console.error('Error fetching trainer details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTrainerTotalRevenue = async (req, res) => {
  const { trainerId } = req.params;
  console.log(trainerId);

  try {
    // Step 1: Find the trainer based on the `trainerId`
    const trainer = await Trainer.findOne({ user: trainerId });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const programmeIds = trainer.programmes; // Assuming 'programmes' is an array of ObjectIds

    // Step 2: Fetch each programme individually based on the programmeIds array
    const programmes = await Promise.all(
      programmeIds.map(async (programmeId) => {
        // Fetch the programme by its _id
        const programme = await Programme.findById(programmeId);

        // Step 3: Search for users who have this programmeId in their `takenProgrammes` array
        const users = await User.find({
          takenProgrammes: { $in: [programmeId] },
        });
        console.log(users);

        // Return the programme along with the users who have taken it
        return {
          programme,
          users, // Users who have taken this programme
        };
      })
    );

    // Step 4: Send the trainer and all programmes (including users who took the programme)
    return res.status(200).json({
      trainer,
      programmes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Something went wrong',
    });
  }
};
