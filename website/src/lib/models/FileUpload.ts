import { Schema, model, models } from 'mongoose';
import { FileUpload } from '@/types';

const FileUploadSchema = new Schema<FileUpload>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  processedDate: Date,
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded',
  },
  results: [{
    type: Schema.Types.ObjectId,
    ref: 'SentimentAnalysis',
  }],
  errorMessage: String,
}, {
  timestamps: true,
});

// Create indexes for better performance
FileUploadSchema.index({ userId: 1, uploadDate: -1 });
FileUploadSchema.index({ status: 1 });

// Transform output to match our interface
FileUploadSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret._id = ret._id.toString();
    return ret;
  }
});

export const FileUploadModel = models.FileUpload || model<FileUpload>('FileUpload', FileUploadSchema);
