import Programme from '../model/programmeModel.js';
import User from '../model/userModel.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';
import deleteFile from '../middleware/removeMulterFile.js';

//Create Programme  || Categories
export const createProgramme = async (req, res) => {
  const { category, price, desc, trainerEmail } = req.body;
  const userId = req.params.id;
  console.log(req.file);

  try {
    // Handle file upload to Cloudinary if a category photo is uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file); // Upload file to Cloudinary
      const categoryPhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      let trainerUser;
      if (trainerEmail) {
        trainerUser = await User.findOne({ email: trainerEmail });
        if (!trainerUser) {
          return res.status(404).json({ error: 'Trainer not found.' });
        }

        if (trainerUser.role !== 'trainer') {
          return res
            .status(400)
            .json({ error: 'The specified user is not a trainer.' });
        }
      }

      // Check if a programme with the same category already exists for the user
      let existingProgramme = await Programme.findOne({
        category,
        user: userId,
      });

      if (existingProgramme) {
        // Update the existing programme
        existingProgramme.categoryPhoto =
          categoryPhoto || existingProgramme.categoryPhoto;
        existingProgramme.desc = desc || existingProgramme.desc;
        existingProgramme.price = price || existingProgramme.price;

        try {
          // Save the updated programme
          const updatedProgramme = await existingProgramme.save();
          deleteFile(updatedProgramme.categoryPhoto);
          return res.status(200).json({
            message: 'Programme updated successfully.',
            programme: updatedProgramme,
          });
        } catch (saveError) {
          console.error('Error saving updated programme:', saveError);
          return res.status(500).json({ error: 'Error updating programme.' });
        }
      } else {
        // Create a new Programme document
        const newProgramme = new Programme({
          category,
          categoryPhoto: categoryPhoto,
          desc,
          price,
        });

        try {
          // Save the new programme to the database
          const savedProgramme = await newProgramme.save();
          deleteFile(savedProgramme.categoryPhoto);

          // Respond with success message or the saved programme data
          return res.status(201).json({
            message: 'Programme created and added to user.',
            programme: savedProgramme,
          });
        } catch (saveError) {
          console.error('Error saving new programme:', saveError);
          return res.status(500).json({ error: 'Error creating programme.' });
        }
      }
    } else {
      // Handle case where no file is uploaded
      return res.status(400).json({ error: 'No file uploaded.' });
    }
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
  const userId = req.params.id;
  const programmeId = req.query.programmeId;
  const { category, image, desc, price, trainerId } = req.body;

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
    programmeId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the programme to be deleted in user's programmes array
    const programmeIndex = user.programmes.findIndex((prog) => {
      const programme = prog._id.toString(); // Convert _id to string if not already
      return programme === programmeId; // Compare programme _id with programmeId
    });

    if (programmeIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Programme not found for this user' });
    }

    const programme = user.programmes[programmeIndex]._id.toString();

    const programmeDetail = await Programme.findById(programme);

    if (!programmeDetail) {
      return res
        .status(404)
        .json({ message: 'Programme not found for this user' });
    }

    programmeDetail.category = category;
    programmeDetail.images = image;
    programmeDetail.price = price;
    programmeDetail.desc = desc;
    programmeDetail.trainer = trainerId || null;

    // Save the updated programme
    const updatedProgramme = await programmeDetail.save();

    // Respond with success message or the updated programme
    res.status(200).json({
      message: 'Programme updated successfully',
      programme: updatedProgramme,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//delete programme
export const deleteProgramme = async (req, res) => {
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
    programmeId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the programme to be deleted in user's programmes array
    const programmeIndex = user.programmes.findIndex((prog) => {
      const programme = prog._id.toString(); // Convert _id to string if not already
      return programme === programmeId; // Compare programme _id with programmeId
    });

    if (programmeIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Programme not found for this user' });
    }

    // Remove the programme from the array
    user.programmes.splice(programmeIndex, 1);

    // Save the updated user object
    await user.save();

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
