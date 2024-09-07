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
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    console.log('Received User IDs:', userIds);

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No users to delete' });
    }

    // Validate each ID
    const validUserIds = [];
    const invalidUserIds = [];

    userIds.forEach((id) => {
      if (id && mongoose.isValidObjectId(id)) {
        validUserIds.push(id);
      } else {
        invalidUserIds.push(id);
      }
    });

    if (invalidUserIds.length > 0) {
      console.error('Invalid User IDs:', invalidUserIds);
      return res
        .status(400)
        .json({ message: 'Invalid user IDs', invalidUserIds });
    }

    if (validUserIds.length === 0) {
      return res.status(400).json({ message: 'No valid user IDs to delete' });
    }

    // Check if users exist
    const usersToDelete = await User.find({ _id: { $in: validUserIds } });
    console.log('Users to be deleted:', usersToDelete);

    if (usersToDelete.length === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    // Delete associated data
    for (const user of usersToDelete) {
      // Delete profile photo from Cloudinary
      if (user.profilePhoto.public_id) {
        try {
          await cloudinary.uploader.destroy(user.profilePhoto.public_id);
        } catch (error) {
          console.error(
            `Failed to delete Cloudinary photo for user ${user._id}:`,
            error.message
          );
        }
      }

      if (user.role === 'trainer') {
        // Delete related Trainer
        const trainer = await Trainer.findOne({ user: user._id });
        if (trainer) {
          // Delete description image from Cloudinary
          if (trainer.description) {
            const description = await Description.findById(trainer.description);
            if (description && description.image.public_id) {
              try {
                await cloudinary.uploader.destroy(description.image.public_id);
              } catch (error) {
                console.error(
                  `Failed to delete Cloudinary photo for description ${description._id}:`,
                  error.message
                );
              }
            }

            // Delete related programmes and their photos from Cloudinary
            const programmes = await Programme.find({
              _id: { $in: trainer.programmes },
            });
            for (const programme of programmes) {
              if (programme.categoryPhoto.public_id) {
                try {
                  await cloudinary.uploader.destroy(
                    programme.categoryPhoto.public_id
                  );
                } catch (error) {
                  console.error(
                    `Failed to delete Cloudinary photo for programme ${programme._id}:`,
                    error.message
                  );
                }
              }
              // Remove the programme from the trainer's programmes
              trainer.programmes = trainer.programmes.filter(
                (p) => !programme._id.equals(p)
              );
            }

            // Save the trainer without the deleted programmes
            await trainer.save();

            // Delete Trainer
            await Trainer.findByIdAndDelete(trainer._id);

            // Delete Descriptions
            await Description.deleteMany({
              _id: { $in: [trainer.description] },
            });
          }
        }
      }
    }

    // Delete Users
    await User.deleteMany({ _id: { $in: validUserIds } });

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

    console.log(`${recipientType}s fetched:`, recipients);

    // Send email to each recipient
    for (const recipient of recipients) {
      // Determine email based on recipientType
      const email = recipient.email;

      if (email) {
        try {
          await sendEmail({ email, subject, message });
          console.log(`Email sent to: ${email}`);
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

    console.log('All emails processed');
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending advertisements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
