const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			status: 'fail',
			statusCode: 422,
			message: 'Validation failed',
			errors: errors.array(),
			data: null,
		});
	}

	next();
};

module.exports = validate;
