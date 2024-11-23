import { Express } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import teacherRoutes from './teacherRoutes';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/teachers', teacherRoutes);
};
