# School Management System - Backend

A Node.js/Express.js backend application for managing multiple schools with role-based authentication.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- TypeORM
- PostgreSQL
- JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=school_management
```

## Database Setup

1. Create a PostgreSQL database named `school_management`
2. The application will automatically create the required tables on startup

## Installation

```bash
# Install dependencies
npm install

# Run migrations
npm run typeorm migration:run

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Schools
- GET `/api/schools` - Get all schools (requires authentication)
- POST `/api/schools` - Create a new school (requires super_admin role)
- PUT `/api/schools/:id` - Update a school (requires super_admin role)
- DELETE `/api/schools/:id` - Delete a school (requires super_admin role)

## User Roles

```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  HEALTH_STAFF = 'health_staff'
}
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── migrations/     # Database migrations
└── server.ts      # Application entry point
```

## Error Handling

The application uses a global error handler middleware that catches all errors and returns appropriate HTTP responses.

## Authentication

JWT-based authentication is implemented with role-based access control. Tokens are required for protected routes and must be included in the Authorization header:

```
Authorization: Bearer <token>
```
