const required = ['MONGO_URI', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key])
    throw new Error(`Missing required environment variable: ${key}`);
});

module.exports = {
  port:    parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV           || 'development',

  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

  isDev:  process.env.NODE_ENV === 'development',
  isprod: process.env.NODE_ENV === 'production',
  istest: process.env.NODE_ENV === 'test',
};