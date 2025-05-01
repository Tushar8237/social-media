import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware to parse JSON requests and enable CORS
app.use(express.json());
app.use(cors());

// Sample route for user authentication
app.get('/', (req, res) => {
    res.send('Authentication Service is running!');
});

// routes
app.use('/api/auth', authRoutes);

// Global error handler
app.use(errorHandler);

export default app;