import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '15d', // Token expires in 15 days
    });

    // Set JWT token as a cookie in the response
    res.cookie('jwt', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // Max age of cookie (in milliseconds) - 15 days
      httpOnly: true, // Cookie accessible only by the web server, not by JavaScript running in the browser (prevent XSS attacks)
      sameSite: 'strict', // Cookie sent only in same-site requests (prevent CSRF attacks)
      secure: process.env.NODE_ENV !== 'development', // Cookie sent over HTTPS only in production environment
    });

    return token; // Return the token if needed
  } catch (err) {
    console.error('Error generating token and setting cookie:', err);
    throw new Error('Token generation failed'); // Throw error if token generation fails
  }
};

export default generateTokenAndSetCookie;
