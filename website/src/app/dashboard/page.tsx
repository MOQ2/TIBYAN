'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Upload,
  ArrowUp,
  ArrowDown,
  Loader2,
  Activity,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  Sparkles,
  Calendar,
  Star
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
      <div className="space-y-8">
        {/* Enhanced Header with Welcome Message */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-green-100">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-amiri arabic-decorative">
                      مرحباً، {session.user?.name}
                    </h1>
                    <p className="text-gray-600 text-lg font-amiri">
                      نظرة شاملة على تحليلات المشاعر والأداء
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                {useRealData ? (
                  <div className="flex items-center space-x-2 space-x-reverse text-sm bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium border border-green-200">
                    <Activity className="h-4 w-4" />
                    <span>البيانات المباشرة</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 space-x-reverse text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium border border-blue-200">
                    <FileText className="h-4 w-4" />
                    <span>البيانات التجريبية</span>
                  </div>
                )}
                <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-full border">
                  <Calendar className="h-4 w-4 inline ml-1" />
                  {new Date().toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Conversations Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>                <div className="text-right">
                  <CardTitle className="text-sm font-medium text-blue-700 font-amiri">إجمالي المحادثات</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">              <div className="text-3xl font-bold text-blue-900 mb-1 font-amiri">
                {totalConversations.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-blue-600 font-amiri">
                <TrendingUp className="h-4 w-4 ml-1" />
                <span>{todayConversations} اليوم</span>
              </div>
            </CardContent>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full translate-x-16 translate-y-16"></div>
          </Card>

          {/* Total Messages Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-sm font-medium text-purple-700">إجمالي الرسائل</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {totalMessages.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-purple-600">
                <BarChart3 className="h-4 w-4 ml-1" />
                <span>{currentAnalytics?.averageMessagesPerConversation || '--'} متوسط لكل محادثة</span>
              </div>
            </CardContent>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full translate-x-16 translate-y-16"></div>
          </Card>

          {/* Positive Sentiment Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-sm font-medium text-green-700">المشاعر الإيجابية</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-900 mb-1">
                {sentimentData.positive}
              </div>
              <div className="flex items-center text-sm text-green-600">
                {!useRealData && (
                  <>
                    <ArrowUp className="h-4 w-4 ml-1" />
                    <span>{mockStats.weeklyTrend.positive.change}% هذا الأسبوع</span>
                  </>
                )}
                {useRealData && (
                  <>
                    <Star className="h-4 w-4 ml-1" />
                    <span>{totalMessages > 0 ? Math.round((sentimentData.positive / totalMessages) * 100) : 0}% من المجموع</span>
                  </>
                )}
              </div>
            </CardContent>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-200/30 rounded-full translate-x-16 translate-y-16"></div>
          </Card>

          {/* Negative Sentiment Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-sm font-medium text-red-700">المشاعر السلبية</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-red-900 mb-1">
                {sentimentData.negative}
              </div>
              <div className="flex items-center text-sm text-red-600">
                {!useRealData && (
                  <>
                    <ArrowDown className="h-4 w-4 ml-1" />
                    <span>{Math.abs(mockStats.weeklyTrend.negative.change)}% انخفاض</span>
                  </>
                )}
                {useRealData && (
                  <>
                    <AlertTriangle className="h-4 w-4 ml-1" />
                    <span>{totalMessages > 0 ? Math.round((sentimentData.negative / totalMessages) * 100) : 0}% من المجموع</span>
                  </>
                )}
              </div>
            </CardContent>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-200/30 rounded-full translate-x-16 translate-y-16"></div>
          </Card>
        </div>

        {/* Enhanced Charts and Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enhanced Sentiment Distribution Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="h-6 w-6 ml-2 text-blue-600" />
                    توزيع المشاعر
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    نسبة المشاعر المختلفة من إجمالي التحليلات
                  </CardDescription>
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {totalMessages.toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Positive Sentiment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm"></div>
                      <span className="text-lg font-medium text-gray-900">إيجابي</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {sentimentData.positive} رسالة
                      </span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {totalMessages > 0 ? Math.round((sentimentData.positive / totalMessages) * 100) : 0}%
                    </div>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                      style={{ width: `${totalMessages > 0 ? (sentimentData.positive / totalMessages) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Negative Sentiment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm"></div>
                      <span className="text-lg font-medium text-gray-900">سلبي</span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        {sentimentData.negative} رسالة
                      </span>
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {totalMessages > 0 ? Math.round((sentimentData.negative / totalMessages) * 100) : 0}%
                    </div>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                      style={{ width: `${totalMessages > 0 ? (sentimentData.negative / totalMessages) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Neutral Sentiment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-sm"></div>
                      <span className="text-lg font-medium text-gray-900">محايد</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {sentimentData.neutral} رسالة
                      </span>
                    </div>
                    <div className="text-xl font-bold text-yellow-600">
                      {totalMessages > 0 ? Math.round((sentimentData.neutral / totalMessages) * 100) : 0}%
                    </div>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                      style={{ width: `${totalMessages > 0 ? (sentimentData.neutral / totalMessages) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Enhanced Recent Activity */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-indigo-900 flex items-center">
                  <Clock className="h-6 w-6 ml-2 text-indigo-600" />
                  النشاط الأخير
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/conversations')}
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Eye className="h-4 w-4 ml-1" />
                  عرض الكل
                </Button>
              </div>
              <CardDescription className="text-indigo-600 mt-1">
                {useRealData ? 'المحادثات النشطة حالياً' : 'آخر التحليلات التي تم إجراؤها'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {useRealData && recentConversations.length > 0 ? (
                  recentConversations.map((conversation) => {
                    const latestMessage = conversation.messages[conversation.messages.length - 1];
                    return (
                      <div key={conversation._id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        latestMessage?.sentiment?.predictedClass === 'negative' 
                          ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                          : latestMessage?.sentiment?.predictedClass === 'positive'
                          ? 'bg-green-50 border-green-200 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 space-x-reverse mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {(conversation.customerName || conversation.customerId)?.[0] || '#'}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-gray-900">
                                  {conversation.customerName || conversation.customerId}
                                </span>
                                <div className="flex items-center space-x-2 space-x-reverse mt-1">
                                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${
                                    conversation.platform === 'whatsapp' 
                                      ? 'bg-green-100 text-green-800 border border-green-200' 
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {conversation.platform === 'whatsapp' ? 'واتساب' : 'ماسنجر'}
                                  </span>
                                  {latestMessage?.sentiment && (
                                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${
                                      latestMessage.sentiment.predictedClass === 'positive' 
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : latestMessage.sentiment.predictedClass === 'negative'
                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    }`}>
                                      {latestMessage.sentiment.predictedClass === 'positive' ? '😊 إيجابي' : 
                                       latestMessage.sentiment.predictedClass === 'negative' ? '😟 سلبي' : '😐 محايد'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2 bg-white/50 p-2 rounded border">
                              {latestMessage?.content || 'لا توجد رسائل'}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(conversation.endTime || conversation.startTime, 'ar')}</span>
                              </div>
                              {latestMessage?.sentiment?.confidence && (
                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                  ثقة: {formatConfidence(latestMessage.sentiment.confidence)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : useRealData && recentConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">لا توجد محادثات حالياً</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => router.push('/upload')}
                    >
                      رفع محادثات جديدة
                    </Button>
                  </div>
                ) : (
                  // Fallback to mock data with enhanced styling
                  mockStats.recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                      analysis.sentiment === 'negative' 
                        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                        : analysis.sentiment === 'positive'
                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                        : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                    }`}>
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          analysis.sentiment === 'positive' ? 'bg-green-500' :
                          analysis.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {analysis.sentiment === 'positive' ? '😊' : analysis.sentiment === 'negative' ? '😟' : '😐'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 bg-white/50 p-2 rounded border mb-2">
                            {analysis.text}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getSentimentColor(analysis.sentiment)}`}>
                                {analysis.sentiment === 'positive' ? 'إيجابي' : 
                                 analysis.sentiment === 'negative' ? 'سلبي' : 'محايد'}
                              </span>
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                ثقة: {formatConfidence(analysis.confidence)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(analysis.timestamp, 'ar')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-6 w-6 ml-2 text-indigo-600" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription>
              الوصول السريع للمهام الأكثر استخداماً
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Button 
                className="h-20 flex-col space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => router.push('/upload')}
              >
                <Upload className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">رفع ملف جديد</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => router.push('/conversations')}
              >
                <MessageSquare className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">تحليل المحادثات</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => router.push('/analytics')}
              >
                <BarChart3 className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">عرض التقارير</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights Section */}
        {(useRealData && currentAnalytics) || !useRealData ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Performance */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
                  <TrendingUp className="h-6 w-6 ml-2 text-blue-600" />
                  الأداء الأسبوعي
                </CardTitle>
                <CardDescription className="text-blue-600">
                  مقارنة بالأسبوع الماضي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {!useRealData && Object.entries(mockStats.weeklyTrend).map(([sentiment, data]) => (
                    <div key={sentiment} className="flex items-center justify-between p-3 rounded-lg bg-white border">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`w-3 h-3 rounded-full ${
                          sentiment === 'positive' ? 'bg-green-500' :
                          sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="font-medium">
                          {sentiment === 'positive' ? 'إيجابي' : 
                           sentiment === 'negative' ? 'سلبي' : 'محايد'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold">{data.current}</span>
                        <div className={`flex items-center text-sm ${
                          data.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.change > 0 ? (
                            <ArrowUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                          <span>{Math.abs(data.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {useRealData && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">بيانات المقارنة الأسبوعية غير متوفرة حالياً</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-green-100/50">
                <CardTitle className="text-xl font-bold text-green-900 flex items-center">
                  <MessageSquare className="h-6 w-6 ml-2 text-green-600" />
                  توزيع المنصات
                </CardTitle>
                <CardDescription className="text-green-600">
                  المحادثات حسب المنصة
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {useRealData && currentAnalytics ? (
                    <>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white border">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">واتساب</span>
                        </div>
                        <span className="font-bold">{currentAnalytics.platforms.whatsapp}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white border">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">ماسنجر</span>
                        </div>
                        <span className="font-bold">{currentAnalytics.platforms.messenger}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">بيانات المنصات ستظهر هنا عند توفر بيانات حقيقية</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </Sidebar>
  );
}
