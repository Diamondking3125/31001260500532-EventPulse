const ok = (res, data, msg = 'Success', code = 200, status = 'success', extra = {}) => {
  res.status(code).json({ status, message: msg, data, ...extra });
};

module.exports = ok;