import { Schema, model, models } from 'mongoose';
import { Conversation, ConversationMessage, SentimentSummary } from '@/types';

const ConversationMessageSchema = new Schema<ConversationMessage>({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ['customer', 'agent'],
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  sentiment: {
    predictedClass: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'audio', 'document'],
    default: 'text',
  },
});

const SentimentSummarySchema = new Schema<SentimentSummary>({
  positive: {
    type: Number,
    default: 0,
  },
  negative: {
    type: Number,
    default: 0,
  },
  neutral: {
    type: Number,
    default: 0,
  },
  dominant: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
  },
  totalMessages: {
    type: Number,
    default: 0,
  },
});

const ConversationSchema = new Schema<Conversation>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  platform: {
    type: String,
    enum: ['whatsapp', 'messenger'],
    required: true,
  },
  customerId: {
    type: String,
    required: true,
    index: true,
  },
  customerName: String,
  customerPhone: String,
  messages: [ConversationMessageSchema],
  overallSentiment: {
    type: SentimentSummarySchema,
    default: () => ({}),
  },
  startTime: {
    type: Date,
    required: true,
    index: true,
  },
  endTime: Date,  status: {
    type: String,
    enum: ['active', 'resolved', 'archived', 'escalated'],
    default: 'active',
  },
  tags: [String],
  dealtWith: {
    type: Boolean,
    default: false,
  },
  dealtWithAt: {
    type: Date,
  },
  dealtWithBy: {
    type: String,
  },
}, {
  timestamps: true,
});

// Create compound indexes for better query performance
ConversationSchema.index({ userId: 1, startTime: -1 });
ConversationSchema.index({ platform: 1, status: 1 });
ConversationSchema.index({ customerId: 1, platform: 1 });
ConversationSchema.index({ status: 1, startTime: -1 });

// Transform output to match our interface
ConversationSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret._id = ret._id.toString();
    return ret;
  }
});

export const ConversationModel = models.Conversation || model<Conversation>('Conversation', ConversationSchema);
