'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MessageSquare,
  Users,
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  responseTimeStats: {
    average: number;
    fastest: number;
    slowest: number;
  };
  dailyStats: Array<{
    date: string;
    conversations: number;
    messages: number;
    sentiment: { positive: number; negative: number; neutral: number };
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [negativeConversations, setNegativeConversations] = useState<Array<{ _id: string; customerName: string; negativeCount: number }>>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);  // Fetch negative conversations for navigation
  const fetchNegativeConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/conversations?limit=10', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const conversations = data.conversations || [];
          // Filter conversations with negative sentiment
        const negative = conversations
          .filter((conv: Conversation) => conv.messages.some((msg) => msg.sentiment?.predictedClass === 'negative'))
          .map((conv: Conversation) => ({
            _id: conv._id,
            customerName: conv.customerName || conv.customerId,
            negativeCount: conv.messages.filter((msg) => msg.sentiment?.predictedClass === 'negative').length
          }))
          .slice(0, 5); // Top 5 negative conversations
        
        setNegativeConversations(negative);
      }
    } catch (error) {
      console.error('Error fetching negative conversations:', error);
    }
  }, []);

  // Fetch real analytics data from API
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error('Failed to fetch analytics:', response.status);
        // Set empty data as fallback
        setAnalyticsData({
          totalConversations: 0,
          platforms: { whatsapp: 0, messenger: 0 },
          sentiment: { positive: 0, negative: 0, neutral: 0 },
          status: { active: 0, resolved: 0, archived: 0 },
          totalMessages: 0,
          averageMessagesPerConversation: 0,
          responseTimeStats: { average: 0, fastest: 0, slowest: 0 },
          dailyStats: []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set empty data as fallback
      setAnalyticsData({
        totalConversations: 0,
        platforms: { whatsapp: 0, messenger: 0 },
        sentiment: { positive: 0, negative: 0, neutral: 0 },
        status: { active: 0, resolved: 0, archived: 0 },
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        responseTimeStats: { average: 0, fastest: 0, slowest: 0 },
        dailyStats: []
      });
    } finally {
      setLoading(false);
    }  }, [timeRange]);  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchAnalytics();
    fetchNegativeConversations();
  }, [session, status, router, fetchAnalytics, fetchNegativeConversations]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analyticsData) return null;
  return (
    <Sidebar>
      <main className="flex-1 overflow-auto p-6" dir="rtl">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                التحليلات الشخصية
              </h1>
              <p className="text-gray-600">
                إحصائياتك الشخصية وتوزيع المشاعر
              </p>
              {/* Quick Status Indicator */}
              {analyticsData && (
                <div className="mt-3 flex items-center gap-3">
                  {analyticsData.sentiment.negative > 0 ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      حالة تحتاج متابعة فورية
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      حالة مستقرة
                    </div>
                  )}
                  <span className="text-xs text-gray-500">
                    آخر تحديث: {new Date().toLocaleString('ar')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="7d">الأسبوع الماضي</option>
                <option value="30d">الشهر الماضي</option>
                <option value="90d">الثلاثة أشهر الماضية</option>
              </select>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقرير
              </Button>
            </div>          </div>

          {/* Critical Alert for Negative Messages */}
          {analyticsData && analyticsData.sentiment.negative > 0 && (
            <div className="mb-8">
              <Card className="border-red-200 bg-gradient-to-r from-red-50 via-red-100 to-pink-50 shadow-2xl ring-2 ring-red-300/50 relative overflow-hidden">
                {/* Background pattern for urgency */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239, 68, 68, 0.1) 10px, rgba(239, 68, 68, 0.1) 20px)'
                  }}></div>
                </div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full animate-pulse shadow-lg">
                        <TrendingDown className="h-6 w-6 text-white" />
                      </div>
                    </div>                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-900 mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
                        تحذير: رسائل سلبية تحتاج للمتابعة
                      </h3>
                      <p className="text-red-700">
                        تم اكتشاف <span className="font-bold text-xl px-2 py-1 bg-red-200 rounded">{analyticsData.sentiment.negative}</span> رسالة سلبية تتطلب تدخلاً فورياً
                      </p>
                    </div><div className="flex-shrink-0">
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg relative"
                        onClick={() => router.push('/analyzer?filter=negative')}
                      >
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        عرض الرسائل السلبية
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>          )}

          {/* Top Negative Conversations for Direct Navigation */}
          {negativeConversations.length > 0 && (
            <div className="mb-8">
              <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-orange-900">
                    <MessageSquare className="h-5 w-5" />
                    أهم المحادثات السلبية - انقر للوصول المباشر
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    اضغط على أي محادثة للانتقال إليها مباشرة في محلل المحادثات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {negativeConversations.map((conv) => (
                      <div
                        key={conv._id}
                        onClick={() => router.push(`/analyzer?filter=negative&conversation=${conv._id}`)}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:border-red-300 hover:bg-red-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="font-medium text-gray-900">{conv.customerName}</div>
                            <div className="text-sm text-red-600">
                              {conv.negativeCount} رسالة سلبية
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          انقر للمراجعة ←
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Key Metrics - Redesigned to highlight negative sentiment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">            {/* Negative Messages - Most Important */}
            <Card className="border-red-200 bg-red-50 shadow-lg ring-1 ring-red-200/50 relative">
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                  أولوية
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">رسائل سلبية - أولوية عالية</p>
                    <p className="text-3xl font-bold text-red-600">{analyticsData.sentiment.negative}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-red-500 rounded-full relative">
                      <TrendingDown className="h-6 w-6 text-white" />
                      {analyticsData.sentiment.negative > 0 && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-2 font-medium">
                  {analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral > 0
                    ? `${Math.round((analyticsData.sentiment.negative / (analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral)) * 100)}%`
                    : '0%'} من إجمالي الرسائل
                </p>
                {analyticsData.sentiment.negative > 0 && (
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs"
                      onClick={() => router.push('/analyzer?filter=negative')}
                    >
                      متابعة فورية
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>            {/* Total Conversations */}
            <Card className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => router.push('/analyzer')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">إجمالي المحادثات</p>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.totalConversations.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {analyticsData.totalMessages} رسالة إجمالية
                </p>
                <div className="mt-2 text-xs text-blue-500">← انقر لعرض جميع المحادثات</div>
              </CardContent>
            </Card>

            {/* Positive Messages */}
            <Card className="border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => router.push('/analyzer?filter=positive')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">رسائل إيجابية</p>                    <p className="text-2xl font-bold text-green-600">{analyticsData.sentiment.positive}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral > 0
                    ? `${Math.round((analyticsData.sentiment.positive / (analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral)) * 100)}%`
                    : '0%'} من إجمالي الرسائل
                </p>
                <div className="mt-2 text-xs text-green-500">← انقر لعرض الرسائل الإيجابية</div>
              </CardContent>
            </Card>

            {/* Resolution Status */}
            <Card className="border-purple-200 bg-purple-50 cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => router.push('/analyzer?filter=all')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">المحادثات الطبيعية</p>
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.status.resolved}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  من إجمالي {analyticsData.totalConversations} محادثة
                </p>
                <div className="mt-2 text-xs text-purple-500">← انقر لعرض المحادثات</div>
              </CardContent>
            </Card>
          </div>          {/* Charts Section - Negative Focus Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Sentiment Trend - Enhanced for Negative Detection */}
            <Card className="border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <BarChart3 className="h-5 w-5" />
                  تتبع المشاعر السلبية اليومي
                </CardTitle>
                <CardDescription className="text-red-600">
                  مراقبة مستمرة للمشاعر السلبية التي تحتاج متابعة فورية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.dailyStats.map((day, index) => {
                    const total = day.sentiment.positive + day.sentiment.negative + day.sentiment.neutral;
                    const negativePercentage = total > 0 ? (day.sentiment.negative / total) * 100 : 0;
                    const hasNegative = day.sentiment.negative > 0;
                    
                    return (
                      <div key={index} className={`space-y-2 p-3 rounded-lg ${hasNegative ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString('ar')}</span>
                            {hasNegative && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                مشاعر سلبية
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-600">{day.conversations} محادثة, {day.messages} رسالة</span>
                        </div>
                        {total > 0 && (
                          <>
                            <div className="w-full bg-gray-200 rounded-full h-3 flex shadow-inner">
                              {/* Negative messages first and more prominent */}
                              <div 
                                className="bg-red-500 h-3 rounded-r-full shadow-sm relative"
                                style={{ width: `${negativePercentage}%` }}
                              >
                                {hasNegative && (
                                  <div className="absolute inset-0 bg-red-600 rounded-r-full animate-pulse opacity-50"></div>
                                )}
                              </div>
                              <div 
                                className="bg-gray-400 h-3"
                                style={{ width: `${(day.sentiment.neutral / total) * 100}%` }}
                              />
                              <div 
                                className="bg-green-500 h-3 rounded-l-full"
                                style={{ width: `${(day.sentiment.positive / total) * 100}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className={`text-center p-2 rounded ${hasNegative ? 'bg-red-100 text-red-700 font-bold' : 'text-red-600'}`}>
                                <div className="font-medium">سلبي</div>
                                <div className="text-lg font-bold">{day.sentiment.negative}</div>
                                <div className="text-xs">{negativePercentage.toFixed(1)}%</div>
                              </div>
                              <div className="text-center p-2 rounded text-gray-600">
                                <div className="font-medium">محايد</div>
                                <div className="text-lg font-bold">{day.sentiment.neutral}</div>
                                <div className="text-xs">{total > 0 ? ((day.sentiment.neutral / total) * 100).toFixed(1) : 0}%</div>
                              </div>
                              <div className="text-center p-2 rounded text-green-600">
                                <div className="font-medium">إيجابي</div>
                                <div className="text-lg font-bold">{day.sentiment.positive}</div>
                                <div className="text-xs">{total > 0 ? ((day.sentiment.positive / total) * 100).toFixed(1) : 0}%</div>
                              </div>
                            </div>
                          </>
                        )}
                        {total === 0 && (
                          <div className="text-xs text-gray-500 text-center py-2">
                            لا توجد رسائل محللة
                          </div>                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Platform Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  التوزيع حسب المنصة
                </CardTitle>
                <CardDescription>
                  توزيع المحادثات على منصات التواصل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">واتساب</span>
                      <span className="text-sm text-gray-600">
                        {analyticsData.platforms.whatsapp} محادثة
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: analyticsData.totalConversations > 0 
                            ? `${(analyticsData.platforms.whatsapp / analyticsData.totalConversations) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">ماسنجر</span>
                      <span className="text-sm text-gray-600">
                        {analyticsData.platforms.messenger} محادثة
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: analyticsData.totalConversations > 0 
                            ? `${(analyticsData.platforms.messenger / analyticsData.totalConversations) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>حالة المحادثات:</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>نشطة: {analyticsData.status.active}</span>
                        <span>طبيعية: {analyticsData.status.resolved}</span>
                        <span>مؤرشفة: {analyticsData.status.archived}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Time Analytics - Real Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Response Time Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  إحصائيات أوقات الاستجابة
                </CardTitle>
                <CardDescription>
                  أوقات الاستجابة الفعلية لفريق خدمة العملاء (بالدقائق)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analyticsData.responseTimeStats.average || 'N/A'}
                      </div>
                      <div className="text-sm text-blue-700">متوسط الاستجابة</div>
                      <div className="text-xs text-blue-600">دقيقة</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analyticsData.responseTimeStats.fastest || 'N/A'}
                      </div>
                      <div className="text-sm text-green-700">أسرع استجابة</div>
                      <div className="text-xs text-green-600">دقيقة</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {analyticsData.responseTimeStats.slowest || 'N/A'}
                      </div>
                      <div className="text-sm text-orange-700">أبطأ استجابة</div>
                      <div className="text-xs text-orange-600">دقيقة</div>
                    </div>
                  </div>
                  
                  {/* Response Time Quality Indicator */}
                  {analyticsData.responseTimeStats.average > 0 && (
                    <div className="mt-4 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">تقييم جودة الاستجابة</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          analyticsData.responseTimeStats.average <= 5 
                            ? 'bg-green-100 text-green-800' 
                            : analyticsData.responseTimeStats.average <= 15
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {analyticsData.responseTimeStats.average <= 5 
                            ? 'ممتاز' 
                            : analyticsData.responseTimeStats.average <= 15
                            ? 'جيد'
                            : 'يحتاج تحسين'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            analyticsData.responseTimeStats.average <= 5 
                              ? 'bg-green-500' 
                              : analyticsData.responseTimeStats.average <= 15
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min((20 - analyticsData.responseTimeStats.average) / 20 * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  رؤى الأداء الفعلية
                </CardTitle>
                <CardDescription>
                  تحليل شامل للأداء الفعلي بناءً على البيانات الحقيقية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">إحصائيات التفاعل</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">متوسط الرسائل:</span>
                        <span className="font-bold text-blue-600 ml-2">
                          {analyticsData.averageMessagesPerConversation}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">إجمالي الرسائل:</span>
                        <span className="font-bold text-blue-600 ml-2">
                          {analyticsData.totalMessages.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">حالة المحادثات</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>نشطة</span>
                        <span className="font-bold text-blue-600">{analyticsData.status.active}</span>
                      </div>                      <div className="flex justify-between">
                        <span>طبيعية</span>
                        <span className="font-bold text-green-600">{analyticsData.status.resolved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مؤرشفة</span>
                        <span className="font-bold text-gray-600">{analyticsData.status.archived}</span>
                      </div>
                    </div>
                  </div>

                  {analyticsData.sentiment.negative > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <TrendingDown className="h-4 w-4" />
                        تنبيه هام
                      </h4>
                      <p className="text-sm text-red-700">
                        تم رصد {analyticsData.sentiment.negative} رسالة سلبية تحتاج للمراجعة الفورية
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sentiment Summary - Negative Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                تحليل المشاعر الشامل
              </CardTitle>
              <CardDescription>
                رؤية شاملة للمشاعر مع تركيز خاص على المشاعر السلبية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Negative Sentiment - Most Prominent */}
                <div className="relative">
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 shadow-lg">
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                        أولوية عالية
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-red-600 mb-3">
                      {analyticsData.sentiment.negative}
                    </div>
                    <div className="text-sm text-red-800 font-bold mb-2">
                      مشاعر سلبية تحتاج متابعة
                    </div>
                    <div className="text-lg font-bold text-red-700">
                      {analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral > 0
                        ? `${Math.round((analyticsData.sentiment.negative / (analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral)) * 100)}%`
                        : '0%'}
                    </div>
                    {analyticsData.sentiment.negative > 0 && (
                      <div className="mt-3 p-2 bg-red-200 rounded-lg">
                        <div className="text-xs text-red-800 font-medium">
                          ⚠️ يتطلب تدخل فوري
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Neutral Sentiment */}
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-gray-600 mb-3">
                    {analyticsData.sentiment.neutral}
                  </div>
                  <div className="text-sm text-gray-700 font-medium mb-2">
                    مشاعر محايدة
                  </div>
                  <div className="text-lg font-bold text-gray-600">
                    {analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral > 0
                      ? `${Math.round((analyticsData.sentiment.neutral / (analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral)) * 100)}%`
                      : '0%'}
                  </div>
                </div>
                
                {/* Positive Sentiment */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-3">
                    {analyticsData.sentiment.positive}
                  </div>
                  <div className="text-sm text-green-700 font-medium mb-2">
                    مشاعر إيجابية
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral > 0
                      ? `${Math.round((analyticsData.sentiment.positive / (analyticsData.sentiment.positive + analyticsData.sentiment.negative + analyticsData.sentiment.neutral)) * 100)}%`
                      : '0%'}
                  </div>
                </div>
              </div>
              
              {/* Critical Actions Section */}              {analyticsData.sentiment.negative > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg shadow-lg">
                  <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    إجراءات مطلوبة فوراً
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-800">
                        مراجعة {analyticsData.sentiment.negative} رسالة سلبية
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-800">
                        تحديد الأولويات للمتابعة
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => router.push('/analyzer?filter=negative')}
                    >
                      عرض الرسائل السلبية
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      إنشاء تقرير طارئ
                    </Button>
                  </div>
                </div>
              )}
              
              {analyticsData.totalMessages > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {analyticsData.totalMessages.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-700">إجمالي الرسائل</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {analyticsData.averageMessagesPerConversation}
                      </div>
                      <div className="text-sm text-blue-700">متوسط الرسائل</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {analyticsData.totalConversations}
                      </div>
                      <div className="text-sm text-blue-700">إجمالي المحادثات</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>تصدير البيانات</CardTitle>
              <CardDescription>
                احصل على تقارير مفصلة للبيانات والتحليلات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  تصدير PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  تصدير Excel
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  تصدير CSV
                </Button>
              </div>            </CardContent>
          </Card>
        </div>

        {/* Floating Action Button for Negative Messages */}
        {analyticsData && analyticsData.sentiment.negative > 0 && (
          <div className="fixed bottom-6 left-6 z-50">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl relative group"
              onClick={() => router.push('/analyzer?filter=negative')}
            >
              <div className="absolute -top-2 -right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-xs text-white items-center justify-center font-bold">
                  {analyticsData.sentiment.negative > 9 ? '9+' : analyticsData.sentiment.negative}
                </span>
              </div>
              <TrendingDown className="h-8 w-8" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                رسائل سلبية تحتاج متابعة
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </Button>
          </div>
        )}
      </main>
    </Sidebar>
  );
}
