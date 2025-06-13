import { Schema, model, models } from 'mongoose';
import { SentimentAnalysis } from '@/types';

const SentimentAnalysisSchema = new Schema<SentimentAnalysis>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  originalText: {
    type: String,
    required: true,
  },
  processedText: {
    type: String,
    required: true,
  },
  predictedClass: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  allProbabilities: {
    positive: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    negative: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    neutral: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  platform: {
    type: String,
    enum: ['whatsapp', 'messenger', 'manual'],
    required: true,
  },
  conversationId: {
    type: String,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  metadata: {
    customerPhone: String,
    customerName: String,
    agentId: String,
  },
});

// Create compound indexes for better query performance
SentimentAnalysisSchema.index({ userId: 1, timestamp: -1 });
SentimentAnalysisSchema.index({ predictedClass: 1, timestamp: -1 });
SentimentAnalysisSchema.index({ platform: 1, timestamp: -1 });
SentimentAnalysisSchema.index({ conversationId: 1, timestamp: 1 });

// Transform output to match our interface
SentimentAnalysisSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret._id = ret._id.toString();
    return ret;
  }
});

export const SentimentAnalysisModel = models.SentimentAnalysis || model<SentimentAnalysis>('SentimentAnalysis', SentimentAnalysisSchema);
