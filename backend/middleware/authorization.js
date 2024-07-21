

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user; 
    const userId = req.params.id;
    console.log(userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user is either the owner of the resource or an admin
    if (user._id.toString() !== userId && !user.role.includes(requiredRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If the user is the owner of the resource or an admin, proceed to the next middleware or route handler
    next();
  };
};

export default checkRole;
