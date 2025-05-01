import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
