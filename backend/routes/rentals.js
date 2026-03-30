import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import Rental from '../models/Rental.js';
import Bike from '../models/Bike.js';
import User from '../models/User.js';
import { transformRental } from '../utils/transform.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const router = express.Router();

// Get all rentals (TEMP: DISABLED AUTH FOR TESTING)
router.get('/', catchAsync(async (req, res) => {
 
  const rentals = await Rental.find({})
    .populate({
      path: 'bikeId',
      select: 'name type brand image pricePerHour kmLimit locationId excessKmCharge weekdayRate weekendRate',
      populate: { path: 'locationId', select: 'name city state' },
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.json(rentals.map(transformRental));
}));

// Get rental by ID (TEMP: DISABLED AUTH)
router.get('/:id', catchAsync(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate({
      path: 'bikeId',
      populate: { path: 'locationId', select: 'name city state' },
    })
    .populate('userId', 'name email');

  if (!rental) throw new AppError('Rental not found', 404);

  res.json(transformRental(rental));
}));

// Create rental (TEMP: DISABLED AUTH)
router.post('/', catchAsync(async (req, res) => {
  const { bikeId, userId, startTime, endTime, totalAmount } = req.body;
  
  if (!bikeId || !startTime || !endTime || !userId) {
    throw new AppError('Required fields missing', 400);
  }

  const bike = await Bike.findById(bikeId);
  if (!bike) throw new AppError('Bike not found', 404);

  const newRental = new Rental({ 
    bikeId,
    userId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalAmount,
    status: 'pending'
  });

  const savedRental = await newRental.save();
  res.status(201).json(transformRental(savedRental));
}));

// Update rental status (TEMP: DISABLED AUTH)
router.patch('/:id/status', catchAsync(async (req, res) => {
  const { status } = req.body;
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!rental) throw new AppError('Rental not found', 404);
  res.json(transformRental(rental));
}));

export default router;   