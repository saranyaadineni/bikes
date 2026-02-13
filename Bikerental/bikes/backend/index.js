import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import bikeRoutes from './routes/bikes.js';
import rentalRoutes from './routes/rentals.js';
import userRoutes from './routes/users.js';
import documentRoutes from './routes/documents.js';
import locationRoutes from './routes/locations.js';
import paymentRoutes from './routes/payments.js';
import settingsRoutes from './routes/settings.js';
import heroImageRoutes from './routes/heroImages.js';
import supportRoutes from './routes/support.js';
import { initCronJobs } from './utils/cron.js';

dotenv.config();

const app = express();

/* =====================================
   ✅ IMPORTANT FOR RENDER
===================================== */
const PORT = process.env.PORT || 3000;

/* =====================================
   ✅ CONNECT DATABASE
===================================== */
connectDB();

/* =====================================
   ✅ INIT CRON JOBS
===================================== */
initCronJobs();

/* =====================================
   ✅ TEMPORARY CORS (Allow all for now)
   We will secure this after frontend deploy
===================================== */
app.use(cors({
  origin: '*'
}));

/* =====================================
   ✅ MIDDLEWARE
===================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================
   ✅ ROUTES
===================================== */
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/hero-images', heroImageRoutes);
app.use('/api/support', supportRoutes);

/* =====================================
   ✅ HEALTH CHECK
===================================== */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/* =====================================
   ✅ ROOT ROUTE
===================================== */
app.get('/', (req, res) => {
  res.send('Bike Rental API is running.');
});

/* =====================================
   ✅ GLOBAL ERROR HANDLER
===================================== */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

/* =====================================
   ✅ START SERVER
===================================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
