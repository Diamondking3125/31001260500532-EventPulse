const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const ctrl = require('../controllers/registrations.controller');
const validate = require('../middleware/validate');
const { registrationRules } = require('../middleware/validationRules');

router.use(requireAuth);

router.post('/', registrationRules.create, validate, ctrl.registerForEvent);
router.get('/my', ctrl.getMyRegistrations);
router.delete('/:id', registrationRules.id, validate, ctrl.cancelRegistration);

module.exports = router;