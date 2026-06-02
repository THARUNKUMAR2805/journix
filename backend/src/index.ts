import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRoutes } from './routes/auth';
import { destinationRoutes } from './routes/destinations';
import { hotelRoutes } from './routes/hotels';
import { restaurantRoutes } from './routes/restaurants';
import { transportRoutes } from './routes/transport';
import { packageRoutes } from './routes/packages';
import { reviewRoutes } from './routes/reviews';
import { bookingRoutes } from './routes/bookings';
import { rewardRoutes } from './routes/rewards';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction ? true : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rewards', rewardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'JourniX API is running', timestamp: new Date() });
});

// Serve frontend static files in production
if (isProduction) {
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 JourniX API running on http://localhost:${PORT}`);
});

export default app;
