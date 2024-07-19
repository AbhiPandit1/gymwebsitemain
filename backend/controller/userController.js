import generateTokenAndSetCookie from '../lib/generateToken.js';
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';

//Admin Route Get All user
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

export const getSingleUser = async (req, res) => {
  const userId = req.params.id; // Extract the user ID from route parameters

  try {
    // Find user by ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Handle case where user is not found
    }

    // Prepare response object without sensitive data
    const userResponse = {
      _id: user._id,
      name: user.name,

      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      createdAt: user.createdAt,
      hasTakenProgramme: user.hasTakenProgramme,
    };

    res.status(200).json(userResponse); // Send user data as JSON response
  } catch (err) {
    console.error('Error fetching user:', err); // Log error to console
    res.status(500).json({ message: 'Server Error' }); // Handle server error
  }
};

//Post User(create new user)
export const postUser = async (req, res) => {
  const { password, email, confirmPassword } = req.body;
  console.log(req.body);

  try {
    // Check if user already exists by email
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ error: 'User with that email already exists' });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'Password and Confirm Password do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with hashed password
    user = new User({
      email,
      password: hashedPassword,
    });
    console.log(user);
    try {
      await user.save();
      console.log('User saved successfully!');
    } catch (error) {
      console.error('Error saving user:', error);
      return res.status(500).json({ error: 'Server Error' });
    }

    // Generate JWT token
    const token = generateTokenAndSetCookie(user._id, res);

    // Prepare response object without sensitive data

    // Send success response with user information and token
    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from the response

    console.log(token);

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token,
    });
  } catch (err) {
    // Handle errors
    console.error(err.message);
    res.status(500).json({ error: 'Server Error', err });
  }
};

//Update User
export const updateUser = async (req, res) => {
  const userId = req.params.id; // Extract user ID from route parameters
  const updateData = req.body; // Extract updated data from request body

  try {
    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare response object without sensitive data
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePhoto: updatedUser.profilePhoto,
      gender: updatedUser.gender,
      createdAt: updatedUser.createdAt,
      hasTakenProgramme: updatedUser.hasTakenProgramme,
    };

    res
      .status(200)
      .json({ message: 'User updated successfully', user: userResponse });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

//Admin Route Delete User
export const deleteUser = async (req, res) => {
  const userId = req.params.id; // Extract user ID from route parameters

  try {
    // Find user by ID and delete from database
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
