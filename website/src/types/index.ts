// Core type definitions for TIBYAN platform

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export type UserRole = 'customer_service' | 'quality_supervisor' | 'data_analyst' | 'pr_manager' | 'admin';

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface SentimentAnalysis {
  _id: string;
  userId: string;
  originalText: string;
  processedText: string;
  predictedClass: 'positive' | 'negative' | 'neutral';
  confidence: number;
  allProbabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
  platform: 'whatsapp' | 'messenger' | 'manual';
  conversationId?: string;
  timestamp: Date;
  metadata?: {
    customerPhone?: string;
    customerName?: string;
    agentId?: string;
  };
}

export interface Conversation {
  _id: string;
  userId: string;
  platform: 'whatsapp' | 'messenger';
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  messages: ConversationMessage[];
  overallSentiment: SentimentSummary;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'resolved' | 'archived' | 'escalated';
  tags: string[];
  dealtWith?: boolean;
  dealtWithAt?: Date;
  dealtWithBy?: string;
}

export interface ConversationMessage {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  timestamp: Date;
  sentiment?: {
    predictedClass: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  messageType: 'text' | 'image' | 'audio' | 'document';
}

export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
  dominant: 'positive' | 'negative' | 'neutral';
  totalMessages: number;
}

export interface Analytics {
  userId?: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  totalAnalyses: number;
  sentimentDistribution: SentimentSummary;
  platformBreakdown: {
    whatsapp: number;
    messenger: number;
    manual: number;
  };
  trendData: {
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
  topNegativeKeywords: string[];
  averageConfidence: number;
}

export interface FileUpload {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadDate: Date;
  processedDate?: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  results?: SentimentAnalysis[];
  errorMessage?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// WhatsApp API types
export interface WhatsAppMessage {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    messages?: WhatsAppIncomingMessage[];
    statuses?: WhatsAppStatus[];
  };
  field: string;
}

export interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: 'text' | 'image' | 'audio' | 'document';
}

export interface WhatsAppStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
}

// Messenger API types
export interface MessengerWebhook {
  object: string;
  entry: MessengerEntry[];
}

export interface MessengerEntry {
  id: string;
  time: number;
  messaging: MessengerMessage[];
}

export interface MessengerMessage {
  sender: {
    id: string;
  };
  recipient: {
    id: string;
  };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: MessengerAttachment[];
  };
  postback?: {
    title: string;
    payload: string;
  };
}

export interface MessengerAttachment {
  type: 'image' | 'audio' | 'video' | 'file';
  payload: {
    url: string;
  };
}
