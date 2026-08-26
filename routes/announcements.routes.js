const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const ctrl = require('../controllers/announcements.controller');

router.post('/', requireAuth, requireRole('admin'), ctrl.createAnnouncement);
router.get('/:eventId', ctrl.getAnnouncementsByEvent);

module.exports = router;