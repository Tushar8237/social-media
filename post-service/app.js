import express from 'express';
import cors from 'cors';
import postRoutes from './routes/post.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Post Service is Running!'));

// Routes
app.use('/api/users', postRoutes);


// Global error handler
app.use(errorHandler);

export default app;
