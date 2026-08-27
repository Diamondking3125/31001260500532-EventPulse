const mongoose = require('mongoose');

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then((connection) => {
        console.log(`MongoDB connected: ${connection.connection.host}`);

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB runtime error:', err.message);
        });

        return connection.connection;
      })
      .catch((err) => {
        connectionPromise = undefined;
        throw err;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;