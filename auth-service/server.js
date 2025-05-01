import app from  './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


dotenv.config();
const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Authentication service is running on port ${PORT}`);
})