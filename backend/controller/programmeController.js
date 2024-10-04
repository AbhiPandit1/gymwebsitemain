import Programme from '../model/programmeModel.js';
import User from '../model/userModel.js';
import { uploadProgrammePhoto } from '../middleware/uploadToCloudinary.js';
import deleteFile from '../middleware/removeMulterFile.js';
import mongoose from 'mongoose';
import DayPlan from '../model/programmeDayPlanModel.js';
import DietPlan from '../model/programmeDietPlanModel.js';
import fs from 'fs';
import { deleteCloudinaryImage } from '../middleware/deleteCloudinaryImage.js';

export const createProgramme = async (req, res) => {
  const { category, title, price, desc, trainerEmail, planType, discount } =
    req.body;
  const userId = req.params.id;
  console.log(price, discount);

  // Parse category and description
  let parsedCategory, parsedDesc;
  try {
    parsedCategory = JSON.parse(category); // Convert category from JSON string to array
    parsedDesc = JSON.parse(desc); // Convert desc from JSON string to array
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Invalid category or description format.' });
  }

  // Validate parsed category and description
  if (!Array.isArray(parsedCategory) || parsedCategory.length === 0) {
    return res.status(400).json({
      error: 'Category must be an array with at least one valid value.',
    });
  }

  if (!Array.isArray(parsedDesc) || parsedDesc.length === 0) {
    return res.status(400).json({
      error: 'Description must be an array with at least one valid value.',
    });
  }

  // Validate price, discount, and planType
  if (!price || !planType) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (isNaN(price) || price < 10) {
    return res
      .status(400)
      .json({ error: 'Price should be greater than or equal to 10.' });
  }

  if (discount !== undefined) {
    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res
        .status(400)
        .json({ error: 'Discount should be a number between 0 and 100.' });
    }
  }

  if (!['Diet', 'Day', 'Both'].includes(planType)) {
    return res.status(400).json({ error: 'Invalid plan type.' });
  }

  try {
    let trainerId = userId;

    // Handle trainer by email if provided
    if (trainerEmail) {
      const trainerUser = await User.findOne({ email: trainerEmail });
      if (!trainerUser) {
        return res.status(404).json({ error: 'Trainer not found.' });
      }
      if (trainerUser.role !== 'trainer') {
        return res
          .status(400)
          .json({ error: 'The specified user is not a trainer.' });
      }
      trainerId = trainerUser._id;
    }

    // Validate trainerId
    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ error: 'Invalid trainer ID.' });
    }

    let categoryPhoto = null;

    // Handle file upload if file exists
    if (req.file) {
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ error: 'Only JPEG, PNG, or GIF files are allowed.' });
      }

      const result = await uploadProgrammePhoto(req.file.path); // Ensure path is passed

      categoryPhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // Optionally delete the file from the local server after upload
      const filePath = req.file.path;
      if (filePath) {
        try {
          await unlinkFile(filePath); // This function should remove the file
        } catch (unlinkError) {
          console.error('Failed to delete file after upload:', unlinkError);
          // Logging but not failing the process if file deletion fails
        }
      }
    }

    // Calculate final price after applying discount
    const finalPrice = discount ? price - (price * discount) / 100 : price;
    console.log(finalPrice);

    // Create new programme
    const newProgramme = new Programme({
      category: parsedCategory, // Use parsedCategory
      categoryPhoto, // Include category photo if available
      desc: parsedDesc, // Use parsedDesc
      title,
      price: Number(finalPrice.toFixed(2)), // Apply the final calculated price, rounded to 2 decimal places
      trainer: trainerId,
      planType, // Include planType
      discount: Number(discount) || 0, // Use discount, default to 0 if not provided
    });

    const savedProgramme = await newProgramme.save();

    return res.status(201).json({
      message: 'Programme created successfully.',
      programme: savedProgramme,
    });
  } catch (error) {
    console.error('Error during programme creation:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get all categories from all users
export const getAllCategory = async (req, res) => {
  try {
    const categories = await Programme.find(); // Assuming Programme is your model for categories

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Single Programme (Open)
export const getSingleProgrammeOpen = async (req, res) => {
  const { id } = req.params;

  try {
    const singleProgramme = await Programme.findById(id);

    if (!singleProgramme) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    res.status(200).json({ message: 'success', singleProgramme });
  } catch (error) {
    res.status(400).json({ error: 'There is some error' });
    console.error(error);
  }
};

// Get Programmes (Open)
export const getProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find().populate('trainer', 'name');
    console.log(programmes)

    // Respond with the fetched programmes
    res.status(200).json(programmes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get By Category Programmes
export const getByCategoryProgrammes = async (req, res) => {
  const { category } = req.query;

  try {
    const programmes = await Programme.find({ category }).populate(
      'trainer',
      'name'
    ); // Assuming 'trainer' is a reference field in Programme model

    res.json(programmes);
  } catch (error) {
    console.error('Error fetching programmes by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Programme
export const updateProgramme = async (req, res) => {
  const programmeId = req.params.id;

  // Check if programme ID is provided
  if (!programmeId) {
    return res.status(400).json({ message: 'Programme ID is required' });
  }

  // Extract fields from request body
  const { category, price, trainerEmail, desc, title, discount } = req.body;

  try {
    // Find the programme by ID
    const programme = await Programme.findById(programmeId);
    if (!programme) {
      return res.status(404).json({ message: 'Programme not found' });
    }

    // Handle file upload if present
    let updatedCategoryPhoto = programme.categoryPhoto;
    if (req.file) {
      // Ensure the file is an acceptable image type
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ error: 'Only JPEG, PNG, or GIF files are allowed.' });
      }

      // Upload new image to Cloudinary
      const result = await uploadProgrammePhoto(req.file.path);
      updatedCategoryPhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // Delete the old image from Cloudinary
      if (programme.categoryPhoto?.public_id) {
        await deleteCloudinaryImage(programme.categoryPhoto.public_id);
      }

      // Optionally delete the file from the local server after upload
      const filePath = req.file.path;
      if (filePath) {
        try {
          await unlinkFile(filePath);
        } catch (unlinkError) {
          console.error('Failed to delete file after upload:', unlinkError);
        }
      }
    }

    // Parse and validate the category if provided
    let parsedCategory = programme.category; // Retain current category if not provided
    if (category) {
      try {
        parsedCategory = JSON.parse(category);
        if (!Array.isArray(parsedCategory) || parsedCategory.length === 0) {
          throw new Error('Category must be a non-empty array.');
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid category format.' });
      }
    }

    // Parse and validate the description if provided
    let parsedDesc = programme.desc; // Retain current description if not provided
    if (desc) {
      try {
        parsedDesc = JSON.parse(desc);
        if (
          !Array.isArray(parsedDesc) ||
          parsedDesc.some((d) => typeof d !== 'string')
        ) {
          throw new Error('Description must be an array of strings.');
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid description format.' });
      }
    }

    // Validate and update the discount if provided
    if (discount !== undefined) {
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return res
          .status(400)
          .json({ error: 'Discount should be a number between 0 and 100.' });
      }
      programme.discount = Number(discount);
    }

    // Calculate the discounted price if price and discount are provided
    if (price) {
      const discountedPrice = discount
        ? price - (price * discount) / 100
        : price;
      programme.price = Number(discountedPrice);
    }

    // Update programme fields if provided, otherwise retain current values
    programme.category = parsedCategory;
    programme.trainerEmail = trainerEmail || programme.trainerEmail;
    programme.desc = parsedDesc;
    programme.title = title || programme.title;
    programme.categoryPhoto = updatedCategoryPhoto;

    // Save the updated programme
    const updatedProgramme = await programme.save();

    res.status(200).json({
      message: 'Programme updated successfully.',
      programme: updatedProgramme,
    });
  } catch (error) {
    console.error('Error updating programme:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Delete Programme
export const deleteProgramme = async (req, res) => {
  try {
    const { programmeId } = req.body;

    // Find the programme by ID
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      return res.status(404).json({ message: 'Programme not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (programme.categoryPhoto && programme.categoryPhoto.public_id) {
      try {
        await deleteCloudinaryImage(programme.categoryPhoto.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Proceed with deleting the programme even if the image deletion fails
      }
    }

    // Delete the programme from the database
    await Programme.findByIdAndDelete(programmeId);

    res.status(200).json({ message: 'Programme deleted successfully' });
  } catch (error) {
    console.error('Error deleting programme:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Create Diet Plan
export const createDietPlan = async (req, res) => {
  const { title, description, dietType, date, userId } = req.body;

  if (!title || !description || !dietType || !date || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const dietPlan = new DietPlan({
      title,
      description,
      dietType,
      date,
      userId,
    });

    const savedDietPlan = await dietPlan.save();

    res.status(201).json({
      message: 'Diet plan created successfully',
      dietPlan: savedDietPlan,
    });
  } catch (error) {
    console.error('Error creating diet plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Diet Plan
export const updateDietPlan = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedDietPlan = await DietPlan.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.status(200).json({
      message: 'Diet plan updated successfully',
      dietPlan: updatedDietPlan,
    });
  } catch (error) {
    console.error('Error updating diet plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Diet Plan
export const deleteDietPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDietPlan = await DietPlan.findByIdAndDelete(id);

    if (!deletedDietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.status(200).json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting diet plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create Day Plan
export const createDayPlan = async (req, res) => {
  const { title, description, exercises, userId, date } = req.body;
  console.log(req.body);

  if (!title || !description || !exercises || !userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const dayPlan = new DayPlan({
      title,
      description,
      exercises,
      userId,
      date,
    });

    const savedDayPlan = await dayPlan.save();

    res.status(201).json({
      message: 'Day plan created successfully',
      dayPlan: savedDayPlan,
    });
  } catch (error) {
    console.error('Error creating day plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Day Plan
export const updateDayPlan = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedDayPlan = await DayPlan.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }

    res.status(200).json({
      message: 'Day plan updated successfully',
      dayPlan: updatedDayPlan,
    });
  } catch (error) {
    console.error('Error updating day plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Day Plan
export const deleteDayPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDayPlan = await DayPlan.findByIdAndDelete(id);

    if (!deletedDayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }

    res.status(200).json({ message: 'Day plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting day plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get programme by trainer

export const getByTrainer = async (req, res) => {
  const id = req.params.id; // Assuming the trainer ID comes from the URL parameters

  try {
    // Find all programmes where the trainer field matches the given ID
    const programmes = await Programme.find({ trainer: id });

    // Check if any programmes were found
    if (programmes.length === 0) {
      return res.status(404).json({ message: 'Please add a programme' });
    }

    // Send the response with the programmes
    res.status(200).json({ programmes, message: 'Your Programme' });
  } catch (error) {
    // Log the error and send a 500 response for internal server error
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
