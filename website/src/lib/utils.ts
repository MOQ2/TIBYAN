import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Arabic/English based on locale
 */
export function formatDate(date: Date | string, locale: 'ar' | 'en' = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'ar') {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Get sentiment color based on classification
 */
export function getSentimentColor(sentiment: 'positive' | 'negative' | 'neutral'): string {
  switch (sentiment) {
    case 'positive':
      return 'text-green-700 bg-green-100 border border-green-300';
    case 'negative':
      return 'text-red-700 bg-red-100 border border-red-300';
    case 'neutral':
      return 'text-gray-700 bg-gray-100 border border-gray-300';
    default:
      return 'text-gray-600 bg-gray-50 border border-gray-200';
  }
}

/**
 * Get sentiment emoji
 */
export function getSentimentEmoji(sentiment: 'positive' | 'negative' | 'neutral'): string {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '❓';
  }
}

/**
 * Calculate confidence percentage
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Check if text is Arabic
 */
export function isArabicText(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get user role display name
 */
export function getUserRoleDisplayName(role: string, locale: 'ar' | 'en' = 'en'): string {
  const roleNames = {
    en: {
      customer_service: 'Customer Service',
      quality_supervisor: 'Quality Supervisor',
      data_analyst: 'Data Analyst',
      pr_manager: 'PR Manager',
      admin: 'Administrator',
    },
    ar: {
      customer_service: 'خدمة العملاء',
      quality_supervisor: 'مشرف الجودة',
      data_analyst: 'محلل البيانات',
      pr_manager: 'مدير العلاقات العامة',
      admin: 'مدير النظام',
    },
  };

  return roleNames[locale][role as keyof typeof roleNames[typeof locale]] || role;
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: string, locale: 'ar' | 'en' = 'en'): string {
  const platformNames = {
    en: {
      whatsapp: 'WhatsApp',
      messenger: 'Messenger',
      manual: 'Manual Upload',
    },
    ar: {
      whatsapp: 'واتساب',
      messenger: 'ماسنجر',
      manual: 'رفع يدوي',
    },
  };

  return platformNames[locale][platform as keyof typeof platformNames[typeof locale]] || platform;
}

/**
 * Calculate sentiment distribution percentages
 */
export function calculateSentimentPercentages(sentiment: {
  positive: number;
  negative: number;
  neutral: number;
}): {
  positive: number;
  negative: number;
  neutral: number;
} {
  const total = sentiment.positive + sentiment.negative + sentiment.neutral;
  if (total === 0) return { positive: 0, negative: 0, neutral: 0 };

  return {
    positive: Math.round((sentiment.positive / total) * 100),
    negative: Math.round((sentiment.negative / total) * 100),
    neutral: Math.round((sentiment.neutral / total) * 100),
  };
}

/**
 * Generate chart colors for sentiment data
 */
export function getSentimentChartColors(): {
  positive: string;
  negative: string;
  neutral: string;
} {
  return {
    positive: '#10B981', // Green
    negative: '#EF4444', // Red
    neutral: '#F59E0B',  // Yellow
  };
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
