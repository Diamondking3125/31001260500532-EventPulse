require('dotenv').config();

const express = require('express');
const morgan  = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/events.routes');
const registrationRoutes = require('./routes/registrations.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

start();