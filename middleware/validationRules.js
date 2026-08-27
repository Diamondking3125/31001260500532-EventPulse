const { body, param, query } = require('express-validator');

const eventRules = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isMongoId().withMessage('Category must be a valid MongoDB id'),
    body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  ],
  update: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().isMongoId().withMessage('Category must be a valid MongoDB id'),
    body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('venue').optional().trim().notEmpty().withMessage('Venue cannot be empty'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  ],
  id: [param('id').isMongoId().withMessage('id must be a valid MongoDB id')],
  query: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be at least 1'),
    query('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
  ],
};

const authRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  login: [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
};

const registrationRules = {
  create: [body('event').isMongoId().withMessage('Event must be a valid MongoDB id')],
  id: [param('id').isMongoId().withMessage('id must be a valid MongoDB id')],
};

const announcementRules = {
  create: [
    body('eventId').isMongoId().withMessage('Event must be a valid MongoDB id'),
    body('text').trim().notEmpty().withMessage('Text is required'),
  ],
  eventId: [param('eventId').isMongoId().withMessage('eventId must be a valid MongoDB id')],
};

module.exports = { authRules, eventRules, registrationRules, announcementRules };