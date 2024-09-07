import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import User from '../model/userModel.js';
import Trainer from '../model/trainerModel.js';
import generateTokenAndSetCookie from '../lib/generateToken.js';
import { deleteCloudinaryImage } from '../middleware/deleteCloudinaryImage.js';
import { uploadProfilePhoto } from '../middleware/uploadToCloudinary.js';

export const createUserDetail = async (req, res) => {
  const userId = req.params.id;
  const { name, gender, role } = req.body;
  let profilePhoto = req.file;

  try {
    // Find the user to get current profile photo details
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If a profile photo is uploaded, handle it
    if (profilePhoto) {
      try {
        // Delete the existing profile photo from Cloudinary if it exists
        if (existingUser.profilePhoto.public_id) {
          await deleteCloudinaryImage(existingUser.profilePhoto.public_id);
        }

        // Upload the new profile photo to Cloudinary
        const result = await uploadProfilePhoto(profilePhoto.path); // Upload specifically to 'profile_photos'
        profilePhoto = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        // Optionally delete the file from the local server after upload
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Failed to delete local file:', unlinkErr);
          }
        });
      } catch (error) {
        console.error('Failed to handle profile photo:', error);
        return res
          .status(500)
          .json({ error: 'Failed to handle profile photo' });
      }
    }

    // Validate role and gender
    if (!['user', 'trainer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender specified' });
    }

    // Update user details
    const updatedUser = {
      name,
      profilePhoto: profilePhoto || existingUser.profilePhoto, // Use existing photo if no new photo is provided
      gender,
      role,
    };

    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
      runValidators: true, // Ensure validation is applied
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update or create Trainer details if role is 'trainer'
    if (role === 'trainer') {
      const trainerData = {
        user: user._id,
      };

      await Trainer.findOneAndUpdate({ user: user._id }, trainerData, {
        upsert: true,
        new: true,
      });
    }

    // Generate token and set cookie
    const token = generateTokenAndSetCookie(user._id, res);

    // Return updated user and token
    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
