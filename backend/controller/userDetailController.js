import fs from 'fs';
import User from '../model/userModel.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';
import singleUpload from '../middleware/multer.js';

export const createUserDetail = async (req, res) => {
  const userId = req.user._id;
  const token = req.token;
  const { name, gender, role } = req.body;

  try {
    // Use singleUpload middleware to handle file upload
    singleUpload(req, res, async (err) => {
      let profilePhoto = req.file; // Access the uploaded file via req.file

      // If profilePhoto is uploaded, upload it to Cloudinary
      if (profilePhoto) {
        try {
          const result = await uploadToCloudinary(profilePhoto);
          profilePhoto = {
            public_id: result.public_id,
            url: result.secure_url,
          };
        } catch (error) {
          console.error('Failed to upload profile photo to Cloudinary:', error);
          return res
            .status(500)
            .json({ error: 'Failed to upload profile photo to Cloudinary' });
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
        name: name,
        profilePhoto: profilePhoto || { public_id: '', url: '' }, // Ensure it's an empty object if profilePhoto is null
        gender: gender,
        role: role,
      };

      const user = await User.findByIdAndUpdate(userId, updatedUser, {
        new: true,
      });
      await user.save();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log(user, token);
      // Return updated user and token
      res.status(201).json({ user, token });
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
