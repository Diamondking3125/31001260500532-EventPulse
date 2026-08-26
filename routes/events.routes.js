const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const ctrl = require('../controllers/events.controller');
const validate = require('../middleware/validate');
const { eventRules } = require('../middleware/validationRules');

router.get('/', eventRules.query, validate, ctrl.getEvents);
router.get('/:id', eventRules.id, validate, ctrl.getEventById);
router.post('/', eventRules.create, validate, requireAuth, requireRole('admin'), ctrl.createEvent);
router.patch('/:id', eventRules.id, eventRules.update, validate, requireAuth, requireRole('admin'), ctrl.updateEvent);
router.delete('/:id', eventRules.id, validate, requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;