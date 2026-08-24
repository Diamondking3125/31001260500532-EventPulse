const ok = (res, data, msg = 'Success', code = 200) => {
  res.status(code).json({ status: 'success', message: msg, data });
};

module.exports = ok;