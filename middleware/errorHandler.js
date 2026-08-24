const handleValidationError = (err) => {
  const messages = Object.values(err.errors)
    .map((e) => e.message)
    .join(', ');
  return {
    statusCode: 400,
    message: messages,
  };
};

const handleCastError = (err) => {
  return {
    statusCode: 400,
    message: `Invalid value "${err.value}" for field "${err.path}". Please provide a valid ID.`,
  };
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return {
    statusCode: 409,
    message: `A record with ${field} "${value}" already exists. Please use a different ${field}.`,
  };
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = {
    statusCode: err.statusCode || 500,
    message:    err.message    || 'Internal server error',
  };

  if (err.name === 'ValidationError') {
    ({ statusCode, message } = handleValidationError(err));

  } else if (err.name === 'CastError') {
    ({ statusCode, message } = handleCastError(err));

  } else if (err.code === 11000) {
    ({ statusCode, message } = handleDuplicateKeyError(err));
  }

  const clientMessage = err.isOperational 
    ? message
    : "Something went wrong! Please try again later.";

  const body = {
    status: statusCode >= 500 ? 'error' : 'fail',
    statusCode,
    message: clientMessage,
    data: null,
  };

  if (process.env.NODE_ENV === "development") {
    body.name = err.name;
    body.error = err;
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = errorHandler;