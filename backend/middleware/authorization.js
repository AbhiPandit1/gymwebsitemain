const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const user = req.user;
    const userId = req.params.id;
    const trainerId = req.params.trainerId;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user role is included in requiredRoles or if user is the owner
    const hasRequiredRole = requiredRoles.includes(user.role);
    const isOwner =
      user._id.toString() === userId || user._id.toString() === trainerId;

    if (!hasRequiredRole && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('User has the required role or is the owner');
    next();
  };
};

export default checkRole;
