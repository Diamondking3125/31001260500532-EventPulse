const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { authRules } = require('../middleware/validationRules');

router.post('/register', authRules.register, validate, ctrl.register);
router.post('/login', authRules.login, validate, ctrl.login);

module.exports = router;