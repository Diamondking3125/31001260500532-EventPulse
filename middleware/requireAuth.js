const jwt      = require('jsonwebtoken');
const config   = require('../config/config');
const AppError = require('../utils/AppError');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;
    next();

  } catch (err) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = requireAuth;
