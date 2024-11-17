import 'reflect-metadata';
import dotenv from 'dotenv';
import AppDataSource from './config/database';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Database connection and server startup
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
