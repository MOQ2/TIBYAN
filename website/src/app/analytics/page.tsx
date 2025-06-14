'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Users,
  Clock,
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AnalyticsData {
  totalAnalyses: number;
  thisMonth: number;
  avgSentiment: number;
  responseTime: number;
  dailyStats: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  timeDistribution: Array<{
    hour: number;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        totalAnalyses: 1247,
        thisMonth: 312,
        avgSentiment: 0.68, // 0-1 scale, where 1 is most positive
        responseTime: 2.3, // hours
        dailyStats: [
          { date: '2024-01-01', positive: 45, negative: 12, neutral: 23 },
          { date: '2024-01-02', positive: 52, negative: 8, neutral: 19 },
          { date: '2024-01-03', positive: 38, negative: 15, neutral: 27 },
          { date: '2024-01-04', positive: 61, negative: 9, neutral: 22 },
          { date: '2024-01-05', positive: 49, negative: 11, neutral: 25 },
          { date: '2024-01-06', positive: 55, negative: 7, neutral: 18 },
          { date: '2024-01-07', positive: 43, negative: 13, neutral: 29 },
        ],
        categoryBreakdown: [
          { category: 'خدمة العملاء', count: 450, percentage: 36 },
          { category: 'المبيعات', count: 320, percentage: 26 },
          { category: 'الدعم التقني', count: 280, percentage: 22 },
          { category: 'الشكاوى', count: 197, percentage: 16 },
        ],
        timeDistribution: [
          { hour: 9, count: 45 },
          { hour: 10, count: 65 },
          { hour: 11, count: 78 },
          { hour: 12, count: 52 },
          { hour: 13, count: 43 },
          { hour: 14, count: 67 },
          { hour: 15, count: 89 },
          { hour: 16, count: 95 },
          { hour: 17, count: 72 },
        ]
      });
      setLoading(false);
    }, 1500);
  }, [session, status, router, timeRange]);

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return 'إيجابي';
    if (score >= 0.4) return 'محايد';
    return 'سلبي';
  };

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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                التحليلات الشخصية
              </h1>
              <p className="text-gray-600">
                إحصائياتك الشخصية وتوزيع المشاعر
              </p>
            </div>
            
            <div className="flex gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="week">الأسبوع الماضي</option>
                <option value="month">الشهر الماضي</option>
                <option value="year">السنة الماضية</option>
              </select>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقرير
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي التحليلات</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalAnalyses.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  +{analyticsData.thisMonth} هذا الشهر
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">متوسط المشاعر</p>
                    <p className={`text-2xl font-bold ${getSentimentColor(analyticsData.avgSentiment)}`}>
                      {getSentimentLabel(analyticsData.avgSentiment)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {(analyticsData.avgSentiment * 100).toFixed(1)}% إيجابية
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">وقت الاستجابة</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.responseTime}س</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  متوسط وقت الرد
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">معدل الرضا</p>
                    <p className="text-2xl font-bold text-green-600">87%</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  من العملاء راضون
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Sentiment Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  توزيع المشاعر اليومي
                </CardTitle>
                <CardDescription>
                  تحليل المشاعر خلال الأسبوع الماضي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.dailyStats.map((day, index) => {
                    const total = day.positive + day.negative + day.neutral;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{new Date(day.date).toLocaleDateString('ar')}</span>
                          <span className="text-gray-600">{total} محادثة</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 flex">
                          <div 
                            className="bg-green-500 h-2 rounded-r-full"
                            style={{ width: `${(day.positive / total) * 100}%` }}
                          />
                          <div 
                            className="bg-gray-400 h-2"
                            style={{ width: `${(day.neutral / total) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500 h-2 rounded-l-full"
                            style={{ width: `${(day.negative / total) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>إيجابي: {day.positive}</span>
                          <span>محايد: {day.neutral}</span>
                          <span>سلبي: {day.negative}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  التوزيع حسب الفئة
                </CardTitle>
                <CardDescription>
                  أنواع المحادثات الأكثر شيوعاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryBreakdown.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm text-gray-600">
                          {category.count} ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                التوزيع الزمني للمحادثات
              </CardTitle>
              <CardDescription>
                أوقات الذروة في المحادثات خلال اليوم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-9 gap-2">
                {analyticsData.timeDistribution.map((time, index) => {
                  const maxCount = Math.max(...analyticsData.timeDistribution.map(t => t.count));
                  const height = (time.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-gray-600 mb-2">
                        {time.hour}:00
                      </div>
                      <div className="w-full bg-gray-200 rounded-t h-20 flex items-end">
                        <div 
                          className="w-full bg-blue-600 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {time.count}
                      </div>
                    </div>
                  );
                })}
              </div>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Sidebar>
  );
}
