import mongoose from 'mongoose';
import sendEmail from '../lib/sendEmail.js';
import Payment from '../model/payementModel.js';
import Programme from '../model/programmeModel.js';
import User from '../model/userModel.js';
import Trainer from '../model/trainerModel.js';
import Description from '../model/descriptionModel.js';
import cloudinary from 'cloudinary';

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    const usersCount = users.length;

    const response = {
      users,
      count: usersCount,
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    // Check if userIds is a valid array and non-empty
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No users to delete' });
    }

    // Validate user IDs
    const validUserIds = userIds.filter((id) => mongoose.isValidObjectId(id));
    const invalidUserIds = userIds.filter(
      (id) => !mongoose.isValidObjectId(id)
    );

    if (invalidUserIds.length > 0) {
      return res
        .status(400)
        .json({ message: 'Invalid user IDs', invalidUserIds });
    }

    if (validUserIds.length === 0) {
      return res.status(400).json({ message: 'No valid user IDs to delete' });
    }

    // Find users by valid IDs
    const usersToDelete = await User.find({ _id: { $in: validUserIds } });

    if (usersToDelete.length === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    // Loop through each user and delete associated data
    for (const user of usersToDelete) {
      // Delete user's profile photo from Cloudinary
      if (user.profilePhoto?.public_id) {
        try {
          await cloudinary.uploader.destroy(user.profilePhoto.public_id);
        } catch (error) {
          console.error(
            `Failed to delete Cloudinary photo for user ${user._id}:`,
            error.message
          );
        }
      }

      // If user is a trainer, handle additional trainer data
      if (user.role === 'trainer') {
        const trainer = await Trainer.findOne({ user: user._id });

        if (trainer) {
          // Delete trainer's description image from Cloudinary
          if (trainer.description) {
            const description = await Description.findById(trainer.description);
            if (description?.image?.public_id) {
              try {
                await cloudinary.uploader.destroy(description.image.public_id);
              } catch (error) {
                console.error(
                  `Failed to delete description photo for trainer ${trainer._id}:`,
                  error.message
                );
              }
            }

            // Delete description document
            await Description.deleteOne({ _id: trainer.description });
          }

          // Delete trainer's related programmes and their images
          const programmes = await Programme.find({
            _id: { $in: trainer.programmes },
          });
          for (const programme of programmes) {
            if (programme.categoryPhoto?.public_id) {
              try {
                await cloudinary.uploader.destroy(
                  programme.categoryPhoto.public_id
                );
              } catch (error) {
                console.error(
                  `Failed to delete programme photo for programme ${programme._id}:`,
                  error.message
                );
              }
            }
          }

          // Delete trainer document
          await Trainer.deleteOne({ _id: trainer._id });
        }
      }
    }

    // Delete users from the database
    await User.deleteMany({ _id: { $in: validUserIds } });

    const trainers = await Trainer.find();
    for (const trainer of trainers) {
      const findUser = await User.findById(trainer.user); // Use trainer.user directly
      if (!findUser) {
        try {
          await Trainer.deleteOne({ _id: trainer._id });
        } catch (error) {
          console.error(
            `Failed to delete trainer ${trainer._id}:`,
            error.message
          );
        }
      }
    }

    res.status(200).json({
      message: 'Users and related data deleted successfully',
      deletedUserIds: validUserIds,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllTrainerProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find().populate(
      'trainer',
      'name email role profilePhoto'
    );
    res.status(200).json({
      success: true,
      count: programmes.length,
      data: programmes,
    });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTrainerProgrammes = async (req, res) => {
  const { programmeIds } = req.body;

  if (!Array.isArray(programmeIds) || programmeIds.length === 0) {
    return res.status(400).json({ message: 'No programme IDs provided' });
  }

  try {
    // Find and delete programmes with the given IDs
    const result = await Programme.deleteMany({ _id: { $in: programmeIds } });

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: 'No programmes found with the provided IDs' });
    }

    // Return a success response with the count of deleted programmes
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} programmes deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting programmes:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    // Fetch payments and populate user and programme details
    const payments = await Payment.find()
      .populate({
        path: 'userId',
        select: 'name email takenProgrammes',
        populate: {
          path: 'takenProgrammes',
          select: 'category price _id trainer',
          populate: {
            path: 'trainer',
            select: 'name email',
          },
        },
      })
      .populate({
        path: 'programmes',
        select: 'category price _id trainer',
        populate: {
          path: 'trainer',
          select: 'name email',
        },
      });

    // Extract programme IDs
    const paymentsWithProgrammeIds = payments.map((payment) => ({
      ...payment._doc, // Spread the existing payment data
      programmeIds: payment.programmes.map((programme) => programme._id), // Extract programme IDs
    }));

    res.status(200).json({
      success: true,
      count: payments.length,
      data: paymentsWithProgrammeIds,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const sendAdvertisment = async (req, res) => {
  const { subject, message, recipientType } = req.body;

  // Validate input
  if (!subject || !message || !recipientType) {
    return res
      .status(400)
      .json({ error: 'Subject, message, and recipientType are required' });
  }

  try {
    let recipients = [];

    if (recipientType === 'user') {
      // Fetch users with the role 'user'
      recipients = await User.find({ role: 'user' });
    } else if (recipientType === 'trainer') {
      // Fetch users with the role 'trainer'
      recipients = await User.find({ role: 'trainer' });
    } else if (recipientType === 'all') {
      // Fetch all users
      recipients = await User.find();
    } else {
      return res.status(400).json({
        error:
          'Invalid recipientType. It must be either "user", "trainer", or "all"',
      });
    }

    // Send email to each recipient
    for (const recipient of recipients) {
      // Determine email based on recipientType
      const email = recipient.email;

      if (email) {
        try {
          await sendEmail({ email, subject, message });
        } catch (emailError) {
          console.error(`Error sending email to ${email}:`, emailError);
          // Optionally, you could collect errors and send a response indicating partial success/failure
        }
      } else {
        console.error(
          'Error: Email address is undefined for recipient',
          recipient
        );
      }
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending advertisements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const selectedProgramme = async (req, res) => {
  const { programmeIds, isSelected } = req.body;

  try {
    // Check if programmeIds is an array and not empty
    if (!Array.isArray(programmeIds) || programmeIds.length === 0) {
      return res.status(400).json({
        error: 'No programme IDs provided',
      });
    }

    // Convert IDs to ObjectId if necessary
    const programmeObjectIds = programmeIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Fetch current state of the documents
    const currentProgrammes = await Programme.find({
      _id: { $in: programmeObjectIds },
    });

    // Perform the update operation
    const result = await Programme.updateMany(
      { _id: { $in: programmeObjectIds } },
      { $set: { isSelected: isSelected } }
    );

    // Check if any documents were modified
    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: 'Programmes updated successfully',
      });
    } else {
      res.status(404).json({
        message: 'No programmes found to update or all are already selected',
      });
    }
  } catch (error) {
    console.error('Error updating programmes:', error);
    res.status(500).json({
      error: 'Programmes are not accessible',
    });
  }
};

export const getAdminTrainerTotalRevenue = async (req, res) => {
  const { trainerId } = req.params; // Extract trainerId from request body

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

        // Return the programme along with the users who have taken it
        return {
          programme,
          users,
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
