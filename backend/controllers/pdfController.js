import fs from 'fs';
import path from 'path';
import multer from 'multer';
import useragent from 'useragent';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { PDF } from '../models/PDF.js';
import { AccessLog } from '../models/AccessLog.js';
import { addWatermarkToPdfBuffer } from '../utils/watermarkService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const studentEmail = req.body.studentEmail || 'unknown@student';

    const watermarkedBuffer = await addWatermarkToPdfBuffer(req.file.buffer, {
      adminEmail,
      studentEmail,
    });

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeOriginalName = path.parse(req.file.originalname).name.replace(/\s+/g, '_');
    const localFilename = `${Date.now()}-${safeOriginalName}.pdf`;
    const localFilePath = path.join(uploadsDir, localFilename);

    await fs.promises.writeFile(localFilePath, watermarkedBuffer);

    const bufferToStream = (buffer) => {
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      return readable;
    };

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'pdf-hub',
          format: 'pdf',
          public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      bufferToStream(watermarkedBuffer).pipe(uploadStream);
    });

    const pdf = await PDF.create({
      title: req.body.title || req.file.originalname,
      originalName: req.file.originalname,
      cloudinaryPublicId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      filename: localFilename,
      uploadedBy: req.user._id,
    });

    res.status(201).json(pdf);
  } catch (error) {
    console.error('Upload PDF error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listPdfs = async (req, res) => {
  const pdfs = await PDF.find().sort({ createdAt: -1 });
  res.json(pdfs);
};

export const streamPdf = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: 'PDF not found' });

    const agent = useragent.parse(req.headers['user-agent']);
    const device = `${agent.toAgent()} on ${agent.os.toString()}`;

    await AccessLog.create({
      user: req.user._id,
      pdf: pdf._id,
      ipAddress: req.ip,
      device,
    });

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filePath = pdf.filename ? path.join(uploadsDir, pdf.filename) : null;

    if (filePath && fs.existsSync(filePath)) {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="protected.pdf"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Content-Type-Options': 'nosniff',
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return;
    }

    if (pdf.cloudinaryUrl) {
      return res.redirect(pdf.cloudinaryUrl);
    }

    return res.status(404).json({ message: 'File missing' });
  } catch (error) {
    console.error('Stream PDF error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

