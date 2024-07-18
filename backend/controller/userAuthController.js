import bcrypt from 'bcryptjs';
// Adjust the path to your User model
// Import your token generation utility function
import User from '../model/userModel.js';
import generateTokenAndSetCookie from '../lib/generateToken.js';

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email in the database
    const user = await User.findOne({ email });

    // If user does not exist, return an error
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Generate token and set cookie
    const token = generateTokenAndSetCookie(user._id, res);

    // Send success response
    return res
      .status(201)
      .json({ message: 'User logged in successfully', token, user });
  } catch (err) {
    // Handle server errors
    console.error('Error during sign-in:', err);
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message });
  }
};

export const signOut = (req, res) => {
  try {
    // Options for clearing cookies
    const cookieOptions = {
      httpOnly: true, // Cookie accessible only by the web server
      sameSite: 'strict', // Cookie sent only in same-site requests
      secure: process.env.NODE_ENV !== 'development', // Cookie sent over HTTPS in production
    };

    // Clear existing 'token' cookie (if it exists)
    res.clearCookie('token', cookieOptions);

    // Clear the 'jwt' cookie explicitly with the same options
    res.clearCookie('jwt', cookieOptions);

    // Send a success response
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    // Handle errors
    console.error('Error during sign-out:', err);
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message });
  }
};
