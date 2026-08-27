require('dotenv').config();

const express = require('express');
const morgan  = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/events.routes');
const registrationRoutes = require('./routes/registrations.routes');
const announcementRoutes = require('./routes/announcements.routes');
const http    = require("http");
const { Server } = require("socket.io");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json());
app.use(mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);
app.set('io', io);

io.on("connection", (socket) => {
  socket.on('join-event', (eventId) => {
    socket.join(eventId);
  });
  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
  console.log("User connected:", socket.id);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", connections: io.engine.clientsCount });
});

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

async function start() {
  await connectDB();
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log('Swagger UI available at https://31001260500532-event-pulse.vercel.app/api-docs');
  });
}

app.use(errorHandler);

start();
