import express from 'express';
import type { Express } from 'express-serve-static-core';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import schoolRoutes from './routes/schoolRoutes';
import studentRoutes from './routes/studentRoutes';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

export default app;
