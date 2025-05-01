import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.middleware.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('User Service is Running!'));

// Routes
app.use('/api/users', userRoutes);

// Global error handler
app.use(errorHandler);

export default app;
