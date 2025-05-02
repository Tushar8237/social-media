import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/post.routes.js';
import errorHandler from './middleware/error.middleware.js';
import User from './models/user.model.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Health check
app.get('/', (req, res) => res.send('Post Service is Running!'));

// Routes
app.use('/api/post', postRoutes);


// Global error handler
app.use(errorHandler);

export default app;
