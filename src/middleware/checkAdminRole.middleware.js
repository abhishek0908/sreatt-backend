// authMiddleware.js
import { UserRoles } from "../utils/constants.js";

const checkAdminRole = (req, res, next) => {
  // Assume `req.user` contains the authenticated user info
  const userRole = req.user.role; // This should be set after authentication
  if (userRole !== UserRoles.ADMIN) {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  next();
};

export { checkAdminRole };
