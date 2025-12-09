# TypeScript Express API

A modern REST API built with TypeScript and Express, featuring a clean architecture and comprehensive testing.

## Features

- **TypeScript** - Type-safe code with full TypeScript support
- **Express** - Fast, unopinionated web framework
- **Jest** - Complete testing setup with example tests
- **ESLint** - Code linting for consistent code style
- **CORS** - Cross-origin resource sharing enabled
- **Environment Variables** - Configuration via .env files

## Project Structure

```
.
├── src/
│   ├── index.ts           # Application entry point
│   └── routes/
│       ├── health.ts      # Health check endpoint
│       ├── health.test.ts # Health endpoint tests
│       ├── users.ts       # User CRUD endpoints
│       └── users.test.ts  # User endpoint tests
├── dist/                  # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
└── .eslintrc.js
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in your .env file).

## API Endpoints

### Health Check

- **GET** `/health` - Check API health status

### Users

- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get a specific user
- **POST** `/api/users` - Create a new user
  - Body: `{ "name": "string", "email": "string" }`
- **PUT** `/api/users/:id` - Update a user
  - Body: `{ "name": "string", "email": "string" }`
- **DELETE** `/api/users/:id` - Delete a user

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Code Quality

Run ESLint:
```bash
npm run lint
```

## Next Steps

This is a starter template. Here are some ideas to extend it:

- Add a database (PostgreSQL, MongoDB, etc.)
- Implement authentication & authorization (JWT, OAuth)
- Add request validation (Zod, Joi)
- Set up Docker containerization
- Add API documentation (Swagger/OpenAPI)
- Implement logging (Winston, Pino)
- Add rate limiting and security middleware (Helmet)
- Set up CI/CD pipelines

## License

MIT
