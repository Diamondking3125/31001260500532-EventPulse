const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const ctrl = require('../controllers/registrations.controller');

router.use(requireAuth);

router.post('/', ctrl.registerForEvent);
router.get('/my', ctrl.getMyRegistrations);
router.delete('/:id', ctrl.cancelRegistration);

module.exports = router;