import Programme from '../model/programmeModel.js';
import User from '../model/userModel.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';
import deleteFile from '../middleware/removeMulterFile.js';
import mongoose from 'mongoose';

//Create Programme  || Categories
export const createProgramme = async (req, res) => {
  const { category, title, price, desc, trainerEmail } = req.body;
  const userId = req.params.id;
  console.log(title);

  let parsedCategory;
  try {
    parsedCategory = JSON.parse(category); // Convert JSON string back to an array
  } catch (error) {
    return res.status(400).json({ error: 'Invalid category format.' });
  }

  console.log(parsedCategory); // Log parsed category to verify

  // Check for missing required fields
  if (!Array.isArray(parsedCategory) || parsedCategory.length === 0) {
    return res.status(400).json({
      error: 'Category must be an array with at least one valid value.',
    });
  }

  if (!price || !desc) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (isNaN(price) || price <= 10) {
    return res.status(400).json({ error: 'Price should be greater than 10.' });
  }

  try {
    let trainerId = userId;

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

    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ error: 'Invalid trainer ID.' });
    }

    let categoryPhoto = null;
    if (req.file) {
      if (req.file.mimetype !== 'image/jpeg') {
        return res.status(400).json({ error: 'Only JPEG files are allowed.' });
      }

      const result = await uploadToCloudinary(req.file);
      categoryPhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const newProgramme = new Programme({
      category: parsedCategory, // Use parsedCategory
      categoryPhoto,
      desc,
      title,
      price: Number(price),
      trainer: trainerId,
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

//Get all category from all user
export const getAllCategory = async (req, res) => {
  try {
    const categories = await Programme.find(); // Assuming Programme is your model for categories

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//getSingleProgramme //open

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

//Get Programme //open

export const getProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find().populate('trainer', 'name');

    // Respond with the fetched programmes
    res.status(200).json(programmes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Get By Category Programme
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

//Update Programme

export const updateProgramme = async (req, res) => {
  const programmeId = req.params.id;

  if (!programmeId) {
    return res.status(400).json({ message: 'Programme ID is required' });
  }

  // Extract fields from request body
  const { category, price, trainerMail, desc, title } = req.body;

  // Log the request body for debugging
  console.log('Request Body:', req.body);

  try {
    // Find the programme by ID
    const programme = await Programme.findById(programmeId);
    if (!programme) {
      return res.status(404).json({ message: 'Programme not found' });
    }

    // Handle file upload if present
    let updatedCategoryPhoto = programme.categoryPhoto;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      updatedCategoryPhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      console.log('Updated Category Photo:', updatedCategoryPhoto);
    }

    // Parse category if provided
    let parsedCategory = programme.category;
    if (category) {
      try {
        parsedCategory = JSON.parse(category); // Convert JSON string back to an array
        if (!Array.isArray(parsedCategory)) {
          throw new Error('Parsed category is not an array.');
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid category format.' });
      }
    }

    // Update programme fields if provided, otherwise retain current values
    programme.category = parsedCategory; // Use parsedCategory here
    programme.price = price ? Number(price) : programme.price;
    programme.trainerMail = trainerMail || programme.trainerMail;
    programme.desc = desc || programme.desc;
    programme.title = title || programme.title;
    programme.categoryPhoto = updatedCategoryPhoto;

    // Save the updated programme
    const updatedProgramme = await programme.save();

    // Send success response
    res.status(200).json({
      message: 'Programme updated successfully',
      programme: updatedProgramme,
    });
  } catch (error) {
    console.error('Error updating programme:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
};

//delete programme
export const deleteProgramme = async (req, res) => {
  const { programmeId } = req.body;
  console.log(req.body);

  // Validate programmeId
  if (!programmeId) {
    return res.status(400).json({ message: 'Programme ID is required' });
  }

  try {
    // Find the programme by programmeId
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      return res.status(404).json({ message: 'Programme not found' });
    }

    // Delete the programme
    await Programme.deleteOne({ _id: programmeId });

    // Respond with success message
    return res.status(200).json({ message: 'Programme deleted successfully' });
  } catch (error) {
    console.error('Error deleting programme:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

//Get Single Programme(After Buying)
export const getSingleProgramme = async (req, res) => {
  const userId = req.params.id;

  const programmeId = req.query.programmeId;

  // Validate userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Validate programmeId
  if (!programmeId) {
    return res.status(400).json({ message: 'Programme ID is required' });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the programme in the user's programmes array
    const programmeIndex = user.programmes.findIndex((prog) => {
      const programme = prog._id.toString(); // Convert _id to string if not already
      return programme === programmeId; // Compare programme _id with programmeId
    });

    if (programmeIndex === -1) {
      return res
        .status(404)
        .json({ message: 'you can access you programme only' });
    }

    const programme = user.programmes[programmeIndex]._id.toString();

    const programmeDetail = await Programme.findById(programme);

    if (!programmeDetail) {
      return res.status(404).json({ message: 'Programme not found' });
    }
    return res
      .status(200)
      .json({ message: 'Successfully retrieved programme', programmeDetail });
  } catch (error) {
    console.error('Error fetching programme:', error);
    return res.status(500).json({ message: 'Server Error' });
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
