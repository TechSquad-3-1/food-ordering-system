import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database'; // No need for .ts in this case
import orderRoutes from './routes/orderRoutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Order routes
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
