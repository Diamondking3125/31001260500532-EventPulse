# EventPulse API

EventPulse is a full-stack RESTful backend application built with Node.js, Express, and MongoDB. It provides comprehensive event management capabilities, including user authentication, role-based access control, event listing with advanced query filtering and pagination, event registration and capacity management, and real-time announcement broadcasting using Socket.io.

## Tech Stack

- **Runtime and Framework:** Node.js, Express.js
- **Database and ODM:** MongoDB, Mongoose
- **Real-time Engine:** Socket.io
- **Testing:** Jest, Supertest
- **Documentation and Tools:** Swagger (OpenAPI 3.0), Postman, Vercel

## Local Installation

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/StudentID-EventPulse.git](https://github.com/your-username/StudentID-EventPulse.git)
cd StudentID-EventPulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Seed the Database

```bash
npm run seed
```

### 5. Start the Development Server

```bash
npm run dev
```

## API Endpoint Summary

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Server uptime and connection health status check |
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Authenticate user and receive JWT token |
| GET | `/api/events` | List all events (supports search, filter, sort, pagination) |
| GET | `/api/events/:id` | Fetch details for a specific event |
| POST | `/api/events` | Create a new event (Admin only) |
| PATCH | `/api/events/:id` | Update event details (Admin only) |
| DELETE | `/api/events/:id` | Remove an event (Admin only) |
| POST | `/api/registrations` | Register current user for an event |
| GET | `/api/registrations/my` | Retrieve registered events for current user |
| DELETE | `/api/registrations/:id` | Cancel an existing event registration |
| POST | `/api/announcements` | Post a real-time event announcement (Admin only) |
| GET | `/api/announcements/:eventId` | Fetch announcement history for an event |

## Live Deployment

- **Live API Base URL:** <https://your-deployment-url.vercel.app>
- **Health Check Endpoint:** <https://your-deployment-url.vercel.app/health>