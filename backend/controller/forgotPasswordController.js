import sendEmail from '../lib/sendEmail.js';
import User from '../model/userModel.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Log the received email to debug
    console.log('Received email:', email);

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: 'User with this email does not exist' });
    }

    // Generate reset token
    const resetToken = user.getResetToken();

    // Save the user document with the reset token and expiration
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    // Create the message
    const message = `Click on the link to reset your password: ${resetUrl}. If you did not request this, please ignore this email.`;

    // Log the email details before sending
    console.log('Sending email to:', user.email);
    console.log('Email message:', message);

    // Send the email
    await sendEmail({
      email: user.email,
      subject: 'Reset Password for your GymWebsite',
      message,
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: `Reset token has been sent to ${user.email}`,
    });
  } catch (error) {
    // Handle potential errors
    console.error('Error in forgotPasswordController:', error);

    res.status(500).json({
      error: 'An error occurred while processing your request',
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { newPassword, confirmNewPassword } = req.body;

    // Hash the reset token to match with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user by the hashed reset token and expiry check
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is not expired
    });

    if (!user) {
      return res.status(400).json({
        error: 'Password reset token is invalid or has expired.',
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        error: 'Password do not match',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Set new hashed password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user object
    await user.save();

    // Optional: You can send a confirmation email to the user here if needed

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
      user,
    });
  } catch (error) {
    console.error('Error in resetPasswordController:', error);

    res.status(500).json({
      error: 'An error occurred while resetting your password.',
    });
  }
};
