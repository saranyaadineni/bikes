import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
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

const app = express();

// =====================================
// ✅ LOGGER
// =====================================
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// =====================================
// ✅ IMPORTANT FOR RENDER
// =====================================
const PORT = process.env.PORT || 3000;

// =====================================
// ✅ CONNECT DATABASE
// =====================================
connectDB();

// =====================================
// ✅ INIT CRON JOBS
// =====================================
initCronJobs();

// =====================================
// ✅ SECURITY MIDDLEWARE
// =====================================
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// =====================================
// ✅ CORS CONFIGURATION
// =====================================
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-production-domain.com']
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// =====================================
// ✅ MIDDLEWARE
// =====================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// ✅ ROUTES
// =====================================
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

// =====================================
// ✅ HEALTH CHECK
// =====================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// =====================================
// ✅ ROOT ROUTE
// =====================================
app.get('/', (req, res) => {
  res.send('Bike Rental API is running.');
});

// =====================================
// ✅ GLOBAL ERROR HANDLER
// =====================================
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

// =====================================
// ✅ START SERVER
// =====================================
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
