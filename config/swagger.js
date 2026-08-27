const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'MongoDB document ID',
  schema: { type: 'string', example: '507f1f77bcf86cd799439011' },
};

const errorResponse = (description) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
});

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'EventPulse API',
    version: '2.0.0',
    description: 'REST API for event management, registration, and announcements.',
  },
  servers: [
    { url: 'https://31001260500532-event-pulse.vercel.app', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Local development' },
  ],
  tags: [
    { name: 'Authentication' }, { name: 'Events' }, { name: 'Registrations' },
    { name: 'Announcements' }, { name: 'Health' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    parameters: { id: idParameter },
    responses: {
      BadRequest: errorResponse('Bad request'),
      Unauthorized: errorResponse('Authentication required'),
      Forbidden: errorResponse('Insufficient permissions'),
      NotFound: errorResponse('Resource not found'),
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'fail' },
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Invalid request' },
          data: { nullable: true },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' }, name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['attendee', 'admin'] },
        },
      },
      EventInput: {
        type: 'object',
        required: ['title', 'description', 'category', 'date', 'city', 'venue', 'capacity'],
        properties: {
          title: { type: 'string' }, description: { type: 'string' },
          category: { type: 'string' }, date: { type: 'string', format: 'date-time' },
          city: { type: 'string' }, venue: { type: 'string' },
          capacity: { type: 'integer', minimum: 1 },
        },
      },
      Event: {
        allOf: [
          { $ref: '#/components/schemas/EventInput' },
          { type: 'object', properties: { _id: { type: 'string' }, organizer: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } },
        ],
      },
      Registration: {
        type: 'object',
        properties: { _id: { type: 'string' }, event: { type: 'string' }, attendee: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' } },
      },
      Announcement: {
        type: 'object',
        properties: { _id: { type: 'string' }, event: { type: 'string' }, text: { type: 'string' }, sender: { $ref: '#/components/schemas/User' }, createdAt: { type: 'string', format: 'date-time' } },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'], summary: 'Check API health',
        responses: { 200: { description: 'API is running' } },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'], summary: 'Register an attendee account',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 6, format: 'password' } } } } } },
        responses: { 201: { description: 'Account created' }, 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'], summary: 'Log in and receive a JWT',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } } } } },
        responses: { 200: { description: 'Login successful' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/api/events': {
      get: {
        tags: ['Events'], summary: 'List events',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } }, { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } }, { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, default: 10 } }, { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['date', 'registrations'] } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
        ],
        responses: { 200: { description: 'Events returned' } },
      },
      post: {
        tags: ['Events'], summary: 'Create an event', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EventInput' } } } },
        responses: { 201: { description: 'Event created' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/api/events/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      get: { tags: ['Events'], summary: 'Get an event', responses: { 200: { description: 'Event returned' }, 404: { $ref: '#/components/responses/NotFound' } } },
      patch: {
        tags: ['Events'], summary: 'Update an event', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EventInput' } } } },
        responses: { 200: { description: 'Event updated' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } },
      },
      delete: { tags: ['Events'], summary: 'Delete an event', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Event deleted' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } } },
    },
    '/api/registrations': {
      post: { tags: ['Registrations'], summary: 'Register for an event', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['event'], properties: { event: { type: 'string' } } } } } }, responses: { 201: { description: 'Registration created' }, 401: { $ref: '#/components/responses/Unauthorized' } } },
    },
    '/api/registrations/my': {
      get: { tags: ['Registrations'], summary: 'List my registrations', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Registrations returned' }, 401: { $ref: '#/components/responses/Unauthorized' } } },
    },
    '/api/registrations/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      delete: { tags: ['Registrations'], summary: 'Cancel my registration', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Registration cancelled' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } } },
    },
    '/api/announcements': {
      post: { tags: ['Announcements'], summary: 'Post an announcement', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['eventId', 'text'], properties: { eventId: { type: 'string' }, text: { type: 'string' } } } } } }, responses: { 201: { description: 'Announcement posted' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } } },
    },
    '/api/announcements/{eventId}': {
      parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { tags: ['Announcements'], summary: 'List event announcements', responses: { 200: { description: 'Announcements returned' } } },
    },
  },
};