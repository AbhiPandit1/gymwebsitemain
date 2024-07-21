import User from '../model/userModel.js';

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field from response
    const usersCount = users.length; // Get the number of users

    // Prepare response object including users array and count
    const response = {
      users: users,
      count: usersCount,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteUsers = async (req, res) => {
  const { userIds } = req.body; // Expect an array of user IDs
  const requestingUserId = req.params.id; // User ID of the requester

  console.log(req.body);
  console.log(req.params.id);

  try {
    // Fetch the requesting user to verify their role
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser) {
      return res.status(404).json({ message: 'Requesting User Not Found' });
    }

    // Check if requesting user has the correct role to perform deletions
    if (requestingUser.role !== 'admin' && requestingUser.role !== 'trainer') {
      return res
        .status(403)
        .json({ message: 'You are not authorized to perform this action' });
    }

    // Validate if userIds are provided and are in array format
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No users to delete' });
    }

    // Find all users to delete
    const usersToDelete = await User.find({ _id: { $in: userIds } });
    if (usersToDelete.length === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    // Perform the deletion
    await User.deleteMany({ _id: { $in: userIds } });

    // Optionally: If you need to delete associated Trainer records, you can do it here
    // For example:
    // await Trainer.deleteMany({ userId: { $in: userIds } });

    res
      .status(200)
      .json({ message: 'Users Deleted Successfully', deletedUserIds: userIds });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
