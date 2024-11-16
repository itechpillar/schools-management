# School Management System - Frontend

A React-based frontend application for managing multiple schools with role-based access control.

## Technologies Used

- React
- TypeScript
- Material-UI
- Axios
- React Router DOM
- JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 3001

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Setup

Create a `.env` file in the root directory with:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Features

- User authentication (login/register)
- Role-based access control
- School management (CRUD operations)
- Responsive Material-UI design
- Form validation
- Error handling with user feedback

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/     # React components
├── services/      # API services
├── interfaces/    # TypeScript interfaces
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── App.tsx        # Root component
```

## Components

### Authentication
- Login
- Register
- Protected Route

### School Management
- Schools List
- School Form
- School Details

## User Roles and Permissions

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

## API Integration

The application uses Axios for API calls. The base API URL is configured in the environment variables.

## Authentication

JWT tokens are stored in localStorage and automatically included in API requests through an Axios interceptor.

## Error Handling

- Form validation errors
- API error responses
- Network errors
- Authentication errors

## Development Guidelines

1. Follow the existing component structure
2. Use TypeScript interfaces for type safety
3. Implement proper error handling
4. Add meaningful comments
5. Follow Material-UI design patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
