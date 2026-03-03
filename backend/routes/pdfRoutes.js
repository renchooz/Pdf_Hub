import express from 'express';
import { uploadPdf, listPdfs, streamPdf, upload } from '../controllers/pdfController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/upload', protect, requireRole('admin'), upload.single('file'), uploadPdf);
router.get('/', protect, listPdfs);
router.get('/:id/stream', protect, streamPdf);

export default router;

