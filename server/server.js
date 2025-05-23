import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import simulationRoutes from './routes/simulationRoutes.js';
import algorithmRoutes from './routes/algorithmRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/simulations', simulationRoutes);
app.use('/api/algorithms', algorithmRoutes);

app.get('/', (req, res) => {
  res.send('CPU Scheduler API is running');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
}); 