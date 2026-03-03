import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    originalName: { type: String, required: true },
    filename: { type: String }, // legacy: stored filename on disk
    cloudinaryPublicId: { type: String }, // new: Cloudinary public ID
    cloudinaryUrl: { type: String }, // new: Cloudinary secure URL
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const PDF = mongoose.model('PDF', pdfSchema);

