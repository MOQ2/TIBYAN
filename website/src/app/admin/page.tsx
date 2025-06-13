'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  TrendingUp,
  Search,
  Download,
  Eye,
  Settings,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface UserAnalytics {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  totalAnalyses: number;
  thisMonth: number;
  avgSentiment: number;
  responseTime: number; // hours
  lastActive: Date;
  status: 'active' | 'inactive';
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAnalyses: number;
  avgResponseTime: number;
  systemUptime: number;
  storageUsed: number;
}

export default function AdminPanelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'data_analyst' | 'quality_supervisor' | 'customer_service'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user is admin
    if (session.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      setSystemStats({
        totalUsers: 45,
        activeUsers: 32,
        totalAnalyses: 15647,
        avgResponseTime: 2.4,
        systemUptime: 99.8,
        storageUsed: 67.3
      });

      setUserAnalytics([
        {
          id: '1',
          name: 'سارة أحمد',
          email: 'sara@company.com',
          role: 'data_analyst',
          department: 'التحليل',
          totalAnalyses: 1247,
          thisMonth: 156,
          avgSentiment: 0.73,
          responseTime: 1.8,
          lastActive: new Date(Date.now() - 1000 * 60 * 30),
          status: 'active',
          sentimentBreakdown: { positive: 756, negative: 245, neutral: 246 }
        },
        {
          id: '2',
          name: 'محمد حسن',
          email: 'mohamed@company.com',
          role: 'quality_supervisor',
          department: 'ضمان الجودة',
          totalAnalyses: 892,
          thisMonth: 98,
          avgSentiment: 0.65,
          responseTime: 2.1,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'active',
          sentimentBreakdown: { positive: 534, negative: 178, neutral: 180 }
        },
        {
          id: '3',
          name: 'فاطمة علي',
          email: 'fatima@company.com',
          role: 'customer_service',
          department: 'خدمة العملاء',
          totalAnalyses: 2156,
          thisMonth: 267,
          avgSentiment: 0.71,
          responseTime: 1.5,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
          status: 'inactive',
          sentimentBreakdown: { positive: 1295, negative: 431, neutral: 430 }
        },
        {
          id: '4',
          name: 'أحمد يوسف',
          email: 'ahmed@company.com',
          role: 'data_analyst',
          department: 'التحليل',
          totalAnalyses: 978,
          thisMonth: 124,
          avgSentiment: 0.69,
          responseTime: 2.0,
          lastActive: new Date(Date.now() - 1000 * 60 * 15),
          status: 'active',
          sentimentBreakdown: { positive: 587, negative: 195, neutral: 196 }
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [session, status, router]);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير النظام';
      case 'data_analyst': return 'محلل البيانات';
      case 'quality_supervisor': return 'مشرف الجودة';
      case 'customer_service': return 'خدمة العملاء';
      default: return role;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  const filteredUsers = userAnalytics.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!systemStats) return null;

  return (
    <Sidebar>
      <main className="flex-1 overflow-auto p-6" dir="rtl">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة إدارة النظام
              </h1>
              <p className="text-gray-600">
                إدارة المستخدمين ومراقبة أداء النظام
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                إضافة مستخدم
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقرير
              </Button>
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المستخدمون النشطون</p>
                    <p className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي التحليلات</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.totalAnalyses.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">متوسط وقت الاستجابة</p>
                    <p className="text-2xl font-bold text-orange-600">{systemStats.avgResponseTime}س</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">وقت تشغيل النظام</p>
                    <p className="text-2xl font-bold text-green-600">{systemStats.systemUptime}%</p>
                  </div>
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">استخدام التخزين</p>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed}%</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                إدارة المستخدمين ({filteredUsers.length})
              </CardTitle>
              <CardDescription>
                عرض وإدارة جميع مستخدمي النظام وإحصائياتهم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="البحث في المستخدمين..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'data_analyst' | 'quality_supervisor' | 'customer_service')}
                  className="border border-gray-300 rounded-md px-3 py-2 min-w-[150px]"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="admin">مدير النظام</option>
                  <option value="data_analyst">محلل البيانات</option>
                  <option value="quality_supervisor">مشرف الجودة</option>
                  <option value="customer_service">خدمة العملاء</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">المستخدم</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">الدور</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">التحليلات</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">متوسط المشاعر</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">وقت الاستجابة</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">آخر نشاط</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.department}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.totalAnalyses.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">+{user.thisMonth} هذا الشهر</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`font-medium ${getSentimentColor(user.avgSentiment)}`}>
                            {(user.avgSentiment * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            إيجابي: {user.sentimentBreakdown.positive}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{user.responseTime}س</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {user.lastActive.toLocaleDateString('ar')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(user.status)}
                            <span className={`text-sm ${user.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                              {user.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Sidebar>
  );
}
