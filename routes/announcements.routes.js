const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { announcementRules } = require('../middleware/validationRules');
const ctrl = require('../controllers/announcements.controller');

router.post('/', announcementRules.create, validate, requireAuth, requireRole('admin'), ctrl.createAnnouncement);
router.get('/:eventId', ctrl.getAnnouncementsByEvent);

module.exports = router;