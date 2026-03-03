import express from 'express';
import { getAccessLogs, getDashboardStats } from '../controllers/trackingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, requireRole('admin'), getDashboardStats);
router.get('/logs', protect, requireRole('admin'), getAccessLogs);

export default router;

