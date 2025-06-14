'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Upload,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, getSentimentColor, formatConfidence } from '@/lib/utils';
import { Conversation } from '@/types';

interface AnalyticsData {
  totalConversations: number;
  platforms: {
    whatsapp: number;
    messenger: number;
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  status: {
    active: number;
    resolved: number;
    archived: number;
  };
  totalMessages: number;
  averageMessagesPerConversation: number;
  dailyStats: Array<{
    date: string;
    conversations: number;
    messages: number;
    sentiment: { positive: number; negative: number; neutral: number };
  }>;
}

interface DashboardData {
  analytics: AnalyticsData;
  recentConversations: Conversation[];
}

// Mock data for demonstration - TODO: Remove when real data is integrated
const mockStats = {
  totalAnalyses: 1247,
  todayAnalyses: 23,
  sentimentDistribution: {
    positive: 456,
    negative: 234,
    neutral: 557,
  },
  recentAnalyses: [
    {
      id: '1',
      text: 'شكراً لكم على الخدمة الممتازة',
      sentiment: 'positive' as const,
      confidence: 0.89,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      platform: 'whatsapp',
    },
    {
      id: '2', 
      text: 'لم أعد راضياً عن مستوى الخدمة',
      sentiment: 'negative' as const,
      confidence: 0.94,
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      platform: 'messenger',
    },
    {
      id: '3',
      text: 'الموضوع عادي لا يوجد مشكلة',
      sentiment: 'neutral' as const,
      confidence: 0.76,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      platform: 'whatsapp',
    },
  ],
  weeklyTrend: {
    positive: { current: 456, previous: 398, change: 14.6 },
    negative: { current: 234, previous: 287, change: -18.5 },
    neutral: { current: 557, previous: 534, change: 4.3 },
  }
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [useRealData, setUseRealData] = useState(false);

  // Fetch real analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?timeRange=7d');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setUseRealData(true);
      } else {
        console.log('Failed to fetch analytics, using mock data');
        setUseRealData(false);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setUseRealData(false);
    }
  };

  // Fetch recent conversations
  const fetchRecentConversations = async () => {
    try {
      const response = await fetch('/api/conversations?limit=5&status=active');
      if (response.ok) {
        const data = await response.json();
        setRecentConversations(data.conversations || []);
      } else {
        console.log('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Fetch real data
    const loadData = async () => {
      await Promise.all([
        fetchAnalytics(),
        fetchRecentConversations()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }
  if (!session) {
    return null;
  }

  // Use real data if available, otherwise fallback to mock data
  const currentAnalytics = useRealData && analytics ? analytics : null;
  const totalMessages = currentAnalytics 
    ? currentAnalytics.totalMessages
    : mockStats.sentimentDistribution.positive + 
      mockStats.sentimentDistribution.negative + 
      mockStats.sentimentDistribution.neutral;

  const sentimentData = currentAnalytics 
    ? currentAnalytics.sentiment
    : mockStats.sentimentDistribution;

  const totalConversations = currentAnalytics 
    ? currentAnalytics.totalConversations 
    : mockStats.totalAnalyses;

  const todayConversations = currentAnalytics 
    ? (currentAnalytics.dailyStats[currentAnalytics.dailyStats.length - 1]?.conversations || 0)
    : mockStats.todayAnalyses;

  return (
    <Sidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              مرحباً، {session.user?.name}
            </h1>
            <p className="text-gray-600">
              نظرة عامة على تحليلات المشاعر لليوم
            </p>
          </div>
          {useRealData && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              البيانات المباشرة
            </div>
          )}
          {!useRealData && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              البيانات التجريبية
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المحادثات</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversations.toLocaleString()}</div>
              <p className="text-xs text-gray-600">
                {todayConversations} اليوم
              </p>
            </CardContent>
          </Card>          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الرسائل</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages.toLocaleString()}</div>
              <p className="text-xs text-gray-600">
                {currentAnalytics?.averageMessagesPerConversation || '--'} متوسط لكل محادثة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المشاعر الإيجابية</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sentimentData.positive}
              </div>
              {!useRealData && (
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 ml-1" />
                  {mockStats.weeklyTrend.positive.change}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المشاعر السلبية</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {sentimentData.negative}
              </div>
              {!useRealData && (
                <div className="flex items-center text-xs text-green-600">
                  <ArrowDown className="h-3 w-3 ml-1" />
                  {Math.abs(mockStats.weeklyTrend.negative.change)}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المشاعر المحايدة</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {sentimentData.neutral}
              </div>
              {!useRealData && (
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 ml-1" />
                  {mockStats.weeklyTrend.neutral.change}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Analysis */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sentiment Distribution Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>توزيع المشاعر</CardTitle>
              <CardDescription>
                نسبة المشاعر المختلفة من إجمالي التحليلات
              </CardDescription>
            </CardHeader>
            <CardContent>              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">إيجابي</span>
                  </div>
                  <div className="text-sm font-medium">
                    {totalMessages > 0 ? Math.round((sentimentData.positive / totalMessages) * 100) : 0}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${totalMessages > 0 ? (sentimentData.positive / totalMessages) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">سلبي</span>
                  </div>
                  <div className="text-sm font-medium">
                    {totalMessages > 0 ? Math.round((sentimentData.negative / totalMessages) * 100) : 0}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${totalMessages > 0 ? (sentimentData.negative / totalMessages) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">محايد</span>
                  </div>
                  <div className="text-sm font-medium">
                    {totalMessages > 0 ? Math.round((sentimentData.neutral / totalMessages) * 100) : 0}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${totalMessages > 0 ? (sentimentData.neutral / totalMessages) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>المحادثات الأخيرة</CardTitle>
              <CardDescription>
                {useRealData ? 'المحادثات النشطة حالياً' : 'آخر التحليلات التي تم إجراؤها'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {useRealData && recentConversations.length > 0 ? (
                  recentConversations.map((conversation) => {
                    const latestMessage = conversation.messages[conversation.messages.length - 1];
                    return (
                      <div key={conversation._id} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 space-x-reverse mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {conversation.customerName || conversation.customerId}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                conversation.platform === 'whatsapp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {conversation.platform === 'whatsapp' ? 'واتساب' : 'ماسنجر'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {latestMessage?.content || 'لا توجد رسائل'}
                            </p>
                            <div className="flex items-center mt-1 space-x-2 space-x-reverse">
                              {latestMessage?.sentiment && (
                                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getSentimentColor(latestMessage.sentiment.predictedClass)}`}>
                                  {latestMessage.sentiment.predictedClass === 'positive' ? 'إيجابي' : 
                                   latestMessage.sentiment.predictedClass === 'negative' ? 'سلبي' : 'محايد'}
                                </span>
                              )}
                              {latestMessage?.sentiment?.confidence && (
                                <span className="text-xs text-gray-500">
                                  {formatConfidence(latestMessage.sentiment.confidence)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(conversation.endTime || conversation.startTime, 'ar')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : useRealData && recentConversations.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    لا توجد محادثات حالياً
                  </p>
                ) : (
                  // Fallback to mock data
                  mockStats.recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {analysis.text}
                          </p>
                          <div className="flex items-center mt-1 space-x-2 space-x-reverse">
                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getSentimentColor(analysis.sentiment)}`}>
                              {analysis.sentiment === 'positive' ? 'إيجابي' : 
                               analysis.sentiment === 'negative' ? 'سلبي' : 'محايد'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatConfidence(analysis.confidence)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(analysis.timestamp, 'ar')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>
              الوصول السريع للمهام الأكثر استخداماً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button 
                className="h-16 flex-col space-y-2"
                onClick={() => router.push('/upload')}
              >
                <Upload className="h-6 w-6" />
                <span>رفع ملف جديد</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => router.push('/conversations')}
              >
                <MessageSquare className="h-6 w-6" />
                <span>تحليل المحادثات</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => router.push('/analytics')}
              >
                <BarChart3 className="h-6 w-6" />
                <span>عرض التقارير</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}
