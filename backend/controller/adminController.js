import sendEmail from '../lib/sendEmail.js';
import Payment from '../model/payementModel.js';
import Programme from '../model/programmeModel.js';
import User from '../model/userModel.js';

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
  const { userIds } = req.body;
  const requestingUserId = req.params.id;

  try {
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser) {
      return res.status(404).json({ message: 'Requesting User Not Found' });
    }

    if (requestingUser.role !== 'admin' && requestingUser.role !== 'trainer') {
      return res
        .status(403)
        .json({ message: 'You are not authorized to perform this action' });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No users to delete' });
    }

    const usersToDelete = await User.find({ _id: { $in: userIds } });
    if (usersToDelete.length === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    await User.deleteMany({ _id: { $in: userIds } });

    res
      .status(200)
      .json({ message: 'Users Deleted Successfully', deletedUserIds: userIds });
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
  const { subject, message } = req.body;

  // Validate input
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required' });
  }

  try {
    // Fetch users from the database
    const users = await User.find();
    console.log('Users fetched:', users);

    // Filter users with role 'user'
    const usersToNotify = users.filter((user) => user.role === 'user');

    // Send email to each user
    for (const user of usersToNotify) {
      try {
        await sendEmail({ email: user.email, subject, message });
        console.log(`Email sent to: ${user.email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${user.email}:`, emailError);
        // Optionally, you could collect errors and send a response indicating partial success/failure
      }
    }

    console.log('All emails processed');
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending advertisements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
