import { User } from '../models/User.js';
import { PDF } from '../models/PDF.js';
import { AccessLog } from '../models/AccessLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalPdfs, totalViews, recentAccessLogs] = await Promise.all([
      User.countDocuments(),
      PDF.countDocuments(),
      AccessLog.countDocuments(),
      AccessLog.find()
        .populate('user', 'name email')
        .populate('pdf', 'title')
        .sort({ accessedAt: -1 })
        .limit(10),
    ]);

    res.json({
      totalUsers,
      totalPdfs,
      totalViews,
      recentAccessLogs,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAccessLogs = async (req, res) => {
  try {
    const logs = await AccessLog.find()
      .populate('user', 'name email')
      .populate('pdf', 'title')
      .sort({ accessedAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Access logs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

