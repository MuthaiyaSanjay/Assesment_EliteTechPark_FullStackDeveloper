const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Log the user object to see if role is present
    console.log('User in roleMiddleware:', req.user);

    console.log("Role MiddleWare :: ");
    
    const userRole = req.user?.role;
    console.log("Role MiddleWare :: " , userRole);
    console.log("User Details ::  " , req.user);
    console.log("User ID ::  " , req.user.id);

    // Ensure that the userRole exists
    if (!userRole) {
      return res.status(403).json({ message: 'Forbidden: No role found' });
    }

    // Check if the route allows "self" access and if the user is accessing their own data
    if (allowedRoles.includes("self")) {
      const userIdFromParams = req.params.id;
      if (req.user.id !== userIdFromParams && req.user.role !== "admin") {
        return res.status(403).json({ message: 'Forbidden: You can only access your own data' });
      }
    }

    // Check if the user's role is included in the allowed roles for this route
    if (!allowedRoles.includes(userRole) && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    next(); // Proceed if the user has the correct role or is accessing their own data
  };
};

module.exports = roleMiddleware;
