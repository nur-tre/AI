import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'eduai_super_secret_jwt_key_2026_education_platform';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired session token. Please log in again.' });
    }

    const user = db.collection('users').findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User account associated with this token not found.' });
    }

    // Exclude password hash from request user object
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: '${req.user.role}'`
      });
    }

    next();
  };
}
