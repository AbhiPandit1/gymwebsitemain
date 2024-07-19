import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

const protectRoute = async (req, res, next) => {
  try {
    // Retrieve JWT token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Token should be in the format "Bearer TOKEN"
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - No Token Provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }

    // Fetch user based on decoded userId
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach user and token to request object
    req.user = user;
    req.token = token;
    console.log(user.email);

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error('Error in protectRoute middleware:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default protectRoute;
