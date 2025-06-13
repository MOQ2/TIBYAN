'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  RefreshCw,
  Filter,
  AlertTriangle,
  Clock,
  Users,
  ArrowUp,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Conversation } from '@/types';
import { formatDate, getSentimentColor } from '@/lib/utils';

export default function ConversationAnalyzerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'whatsapp' | 'messenger'>('all');  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved' | 'archived'>('all');
  const [dealtWithFilter, setDealtWithFilter] = useState<'all' | 'dealt' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'sentiment' | 'priority'>('priority');
  const [showNegativeFirst, setShowNegativeFirst] = useState(true);
  const [dealtWithConversations, setDealtWithConversations] = useState<Set<string>>(new Set());

  // Load dealt with status from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dealtWithConversations');
    if (saved) {
      try {
        const parsedIds = JSON.parse(saved) as string[];
        setDealtWithConversations(new Set(parsedIds));
      } catch (error) {
        console.error('Error loading dealt with conversations from localStorage:', error);
      }
    }
  }, []);

  // Save dealt with status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dealtWithConversations', JSON.stringify([...dealtWithConversations]));
  }, [dealtWithConversations]);
  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations from API...');
      const response = await fetch('/api/conversations?limit=50', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Conversations API response status:', response.status);      if (response.ok) {
        const data = await response.json();
        console.log('Conversations API data:', data);
        const conversationsData = data.conversations || [];
        setConversations(conversationsData);        // Initialize dealt with state from backend data and localStorage
        const backendDealtWithIds = new Set<string>(
          conversationsData
            .filter((conv: Conversation) => conv.dealtWith)
            .map((conv: Conversation) => conv._id)
        );
        
        // Get localStorage data
        const localStorageData = localStorage.getItem('dealtWithConversations');
        let localDealtWithIds = new Set<string>();
        if (localStorageData) {
          try {
            const parsedIds = JSON.parse(localStorageData) as string[];
            localDealtWithIds = new Set(parsedIds);
          } catch (error) {
            console.error('Error parsing localStorage dealt with data:', error);
          }
        }
        
        // Merge backend and localStorage data
        const mergedDealtWithIds = new Set([...backendDealtWithIds, ...localDealtWithIds]);
        
        console.log('Backend dealt with IDs:', backendDealtWithIds);
        console.log('LocalStorage dealt with IDs:', localDealtWithIds);
        console.log('Merged dealt with IDs:', mergedDealtWithIds);
        
        setDealtWithConversations(mergedDealtWithIds);
        
        return true;
      } else {
        console.log('Failed to fetch conversations, status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return false;
    }
  };  // Load conversations on mount and handle URL parameters
  useEffect(() => {
    console.log('Analyzer: useEffect triggered, status:', status, 'session:', !!session);
    
    if (status === 'loading') {
      console.log('Analyzer: Session still loading...');
      return;
    }
    
    if (!session) {
      console.log('Analyzer: No session found, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    console.log('Analyzer: Session found for user:', session.user?.email);

    // Handle URL parameters for filtering
    const filterParam = searchParams.get('filter');
    const conversationParam = searchParams.get('conversation');
    
    if (filterParam) {
      switch (filterParam) {
        case 'negative':
          setSentimentFilter('negative');
          setShowNegativeFirst(true);
          break;
        case 'positive':
          setSentimentFilter('positive');
          break;
        case 'neutral':
          setSentimentFilter('neutral');
          break;
      }
    }

    const loadData = async () => {
      console.log('Analyzer: Loading conversations...');
      const success = await fetchConversations();
      
      if (success && conversationParam) {
        // Auto-select conversation if specified in URL
        setTimeout(() => {
          setConversations(prevConversations => {
            const targetConversation = prevConversations.find(c => c._id === conversationParam);
            if (targetConversation) {
              setSelectedConversation(targetConversation);
            }
            return prevConversations;
          });
        }, 100);
      }
      
      setIsLoading(false);
      console.log('Analyzer: Load complete, success:', success);
    };

    loadData();
  }, [session, status, router, searchParams]);

  // Refresh conversations
  const refreshConversations = async () => {
    setIsRefreshing(true);
    await fetchConversations();
    setIsRefreshing(false);
  };

  // Helper functions
  const getSentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      case 'neutral': return <Minus className="h-4 w-4" />;
    }
  };
  const getSentimentLabel = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'إيجابي';
      case 'negative': return 'سلبي';
      case 'neutral': return 'محايد';
    }
  };

  // Enhanced filtering with priority for negative sentiment
  const getConversationPriority = (conversation: Conversation) => {
    // Count negative messages
    const negativeCount = conversation.messages.filter(m => m.sentiment?.predictedClass === 'negative').length;
    const totalMessages = conversation.messages.length;
    const negativeRatio = totalMessages > 0 ? negativeCount / totalMessages : 0;
    
    // Priority score: higher for more negative sentiment
    if (negativeRatio >= 0.5) return 3; // High priority
    if (negativeRatio >= 0.2) return 2; // Medium priority
    if (negativeRatio > 0) return 1; // Low priority
    return 0; // No negative sentiment
  };
  const hasNegativeSentiment = (conversation: Conversation) => {
    return conversation.messages.some(m => m.sentiment?.predictedClass === 'negative');
  };  // Helper function to check if an ID is a valid MongoDB ObjectId
  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };
  // Mark conversation as dealt with (persist to backend)
  const markAsDealtWith = async (conversationId: string) => {
    try {
      console.log('Marking conversation as dealt with:', conversationId);
        // Check if the ID is a valid MongoDB ObjectId
      if (!isValidObjectId(conversationId)) {
        console.log('Invalid ObjectId, using local state only:', conversationId);
        // For demo data with invalid IDs, just update local state (localStorage will auto-save)
        setDealtWithConversations(prev => new Set([...prev, conversationId]));
        console.log('تم وضع علامة كمحلول (محليًا فقط)');
        return;
      }

      const response = await fetch(`/api/conversations/${conversationId}/dealt-with`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealtWith: true }),
      });

      console.log('Mark as dealt with response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Mark as dealt with result:', result);
        
        // Update local state
        setDealtWithConversations(prev => new Set([...prev, conversationId]));
        // Update the conversation in the list
        setConversations(prev => prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, dealtWith: true, dealtWithAt: new Date(), dealtWithBy: session?.user?.email }
            : conv
        ));        console.log('تم وضع علامة كمحلول');
          // No need to reload, the state update is sufficient
      } else {
        const errorData = await response.json();
        console.error('Failed to mark as dealt with:', errorData);
        // Fallback to local state
        setDealtWithConversations(prev => new Set([...prev, conversationId]));
        console.log('تم وضع علامة كمحلول (محليًا فقط)');
      }
    } catch (error) {
      console.error('Error marking as dealt with:', error);
      // Fallback to local state
      setDealtWithConversations(prev => new Set([...prev, conversationId]));
      console.log('تم وضع علامة كمحلول (محليًا فقط)');
    }
  };  // Unmark conversation as dealt with (persist to backend)
  const unmarkAsDealtWith = async (conversationId: string) => {
    try {
      console.log('Unmarking conversation as dealt with:', conversationId);
        // Check if the ID is a valid MongoDB ObjectId
      if (!isValidObjectId(conversationId)) {
        console.log('Invalid ObjectId, using local state only:', conversationId);
        // For demo data with invalid IDs, just update local state (localStorage will auto-save)
        setDealtWithConversations(prev => {
          const newSet = new Set(prev);
          newSet.delete(conversationId);
          return newSet;
        });
        console.log('تم إلغاء علامة المحلول (محليًا فقط)');
        return;
      }

      const response = await fetch(`/api/conversations/${conversationId}/dealt-with`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealtWith: false }),
      });

      console.log('Unmark as dealt with response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Unmark as dealt with result:', result);
        
        // Update local state
        setDealtWithConversations(prev => {
          const newSet = new Set(prev);
          newSet.delete(conversationId);
          return newSet;
        });
        // Update the conversation in the list
        setConversations(prev => prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, dealtWith: false, dealtWithAt: undefined, dealtWithBy: undefined }
            : conv
        ));        console.log('تم إلغاء علامة المحلول');
        
        // No need to reload, the state update is sufficient
      } else {
        const errorData = await response.json();
        console.error('Failed to unmark as dealt with:', errorData);
        // Fallback to local state
        setDealtWithConversations(prev => {
          const newSet = new Set(prev);
          newSet.delete(conversationId);
          return newSet;
        });
        console.log('تم إلغاء علامة المحلول (محليًا فقط)');
      }
    } catch (error) {
      console.error('Error unmarking as dealt with:', error);
      // Fallback to local state
      setDealtWithConversations(prev => {
        const newSet = new Set(prev);
        newSet.delete(conversationId);
        return newSet;
      });
      console.log('تم إلغاء علامة المحلول (محليًا فقط)');
    }
  };  // Check if conversation is dealt with (from backend or local state)
  const isDealtWith = (conversationId: string) => {
    // First check the conversation data from backend
    const conversation = conversations.find(c => c._id === conversationId);
    if (conversation?.dealtWith === true) return true;
    if (conversation?.dealtWith === false) return false;
    
    // If dealtWith is undefined/null, check local state for newly marked items
    return dealtWithConversations.has(conversationId);
  };
  // Advanced filtering and sorting
  const filteredConversations = conversations
    .filter(conv => {
      // Text search
      const customerName = conv.customerName || conv.customerId;
      const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;

      // Sentiment filter
      if (sentimentFilter !== 'all') {
        if (sentimentFilter === 'negative' && !hasNegativeSentiment(conv)) return false;
        if (sentimentFilter === 'positive' && !conv.messages.some(m => m.sentiment?.predictedClass === 'positive')) return false;
        if (sentimentFilter === 'neutral' && !conv.messages.some(m => m.sentiment?.predictedClass === 'neutral')) return false;
      }

      // Platform filter
      if (platformFilter !== 'all' && conv.platform !== platformFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && conv.status !== statusFilter) return false;

      // Dealt with filter
      if (dealtWithFilter !== 'all') {
        const isDealtwith = isDealtWith(conv._id);
        if (dealtWithFilter === 'dealt' && !isDealtwith) return false;
        if (dealtWithFilter === 'pending' && isDealtwith) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority' || showNegativeFirst) {
        const priorityA = getConversationPriority(a);
        const priorityB = getConversationPriority(b);
        if (priorityA !== priorityB) return priorityB - priorityA; // Higher priority first
      }
      
      if (sortBy === 'date') {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
      
      if (sortBy === 'sentiment') {
        const negativeA = hasNegativeSentiment(a) ? 1 : 0;
        const negativeB = hasNegativeSentiment(b) ? 1 : 0;
        return negativeB - negativeA;
      }

      return 0;
    });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }
  return (
    <Sidebar>
      <div className="space-y-6" dir="rtl">
        {/* Enhanced Header with Statistics */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">محلل المحادثات</h1>
              <p className="text-gray-600">تحليل المشاعر للمحادثات المباشرة مع تركيز على الحالات العاجلة</p>
            </div>
            <Button 
              onClick={refreshConversations} 
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <RefreshCw className="h-4 w-4 ml-2" />
              )}
              تحديث
            </Button>
          </div>
          
          {/* Quick Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{conversations.length}</div>
              <div className="text-sm text-gray-600">إجمالي المحادثات</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-red-600">
                {conversations.filter(c => hasNegativeSentiment(c)).length}
              </div>
              <div className="text-sm text-gray-600">محادثات سلبية</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">
                {conversations.filter(c => c.messages.some(m => m.sentiment?.predictedClass === 'positive')).length}
              </div>
              <div className="text-sm text-gray-600">محادثات إيجابية</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">
                {conversations.filter(c => getConversationPriority(c) >= 2).length}
              </div>
              <div className="text-sm text-gray-600">عالية الأولوية</div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فلاتر متقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Sentiment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حسب المشاعر</label>
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value as 'all' | 'positive' | 'negative' | 'neutral')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المشاعر</option>
                  <option value="negative">سلبية فقط 🔴</option>
                  <option value="positive">إيجابية فقط 🟢</option>
                  <option value="neutral">محايدة فقط 🟡</option>
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حسب المنصة</label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value as 'all' | 'whatsapp' | 'messenger')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المنصات</option>
                  <option value="whatsapp">واتساب</option>
                  <option value="messenger">ماسنجر</option>
                </select>
              </div>              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حسب الحالة</label>                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'resolved' | 'archived')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشطة</option>
                  <option value="resolved">طبيعية</option>
                  <option value="archived">مؤرشفة</option>
                </select>
              </div>

              {/* Dealt With Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حسب المعالجة</label>
                <select
                  value={dealtWithFilter}
                  onChange={(e) => setDealtWithFilter(e.target.value as 'all' | 'dealt' | 'pending')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المحادثات</option>
                  <option value="pending">غير معالجة 🔄</option>
                  <option value="dealt">تمت معالجتها ✅</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'sentiment' | 'priority')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="priority">الأولوية (سلبي أولاً)</option>
                  <option value="date">التاريخ</option>
                  <option value="sentiment">نوع المشاعر</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <Button
                size="sm"
                variant={sentimentFilter === 'negative' ? 'default' : 'outline'}
                onClick={() => setSentimentFilter('negative')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                المحادثات السلبية فقط
              </Button>              <Button
                size="sm"
                variant={showNegativeFirst ? 'default' : 'outline'}
                onClick={() => setShowNegativeFirst(!showNegativeFirst)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                الحالات العاجلة أولاً
              </Button>
              <Button
                size="sm"
                variant={dealtWithFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setDealtWithFilter('pending')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                غير معالجة فقط
              </Button>
              <Button
                size="sm"
                variant={dealtWithFilter === 'dealt' ? 'default' : 'outline'}
                onClick={() => setDealtWithFilter('dealt')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                معالجة بالفعل
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSentimentFilter('all');
                  setPlatformFilter('all');
                  setStatusFilter('all');
                  setDealtWithFilter('all');
                  setSortBy('priority');
                  setSearchQuery('');
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Conversations List */}
          <Card className="lg:col-span-1 shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>المحادثات ({filteredConversations.length})</span>
                </div>
                {filteredConversations.filter(c => hasNegativeSentiment(c)).length > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    {filteredConversations.filter(c => hasNegativeSentiment(c)).length} عاجل
                  </div>
                )}
              </CardTitle>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في المحادثات والرسائل..."
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <h3 className="font-medium text-gray-700 mb-1">لا توجد محادثات</h3>
                    <p className="text-sm">جرب تغيير المرشحات أو البحث</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const priority = getConversationPriority(conversation);
                    const isNegative = hasNegativeSentiment(conversation);
                    const negativeCount = conversation.messages.filter(m => m.sentiment?.predictedClass === 'negative').length;
                    
                    return (
                      <div
                        key={conversation._id}
                        className={`p-4 border-b cursor-pointer transition-all duration-200 relative ${
                          selectedConversation?._id === conversation._id 
                            ? 'bg-blue-50 border-r-4 border-r-blue-500 shadow-md' 
                            : 'hover:bg-gray-50'
                        } ${
                          isNegative ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >                        {/* Priority Badge */}
                        {priority >= 2 && (
                          <div className="absolute top-2 left-2">
                            <div className={`w-3 h-3 rounded-full ${
                              priority === 3 ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                            }`}></div>
                          </div>
                        )}

                        {/* Dealt With Badge */}
                        {isDealtWith(conversation._id) && (
                          <div className="absolute top-2 right-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <CheckCircle className="h-3 w-3" />
                              معالج
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-sm">
                                {conversation.customerName || conversation.customerId}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                conversation.platform === 'whatsapp' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {conversation.platform === 'whatsapp' ? 'واتساب' : 'ماسنجر'}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                              {conversation.messages[0]?.content || 'لا توجد رسائل'}
                            </p>
                              {/* Enhanced Status Row */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {formatDate(conversation.endTime || conversation.startTime, 'ar')}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Negative Messages Warning */}
                                {isNegative && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    <TrendingDown className="h-3 w-3" />
                                    {negativeCount} سلبي
                                  </div>
                                )}
                                
                                {/* Overall Sentiment */}
                                {conversation.overallSentiment?.dominant && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(conversation.overallSentiment.dominant)}`}>
                                    {getSentimentLabel(conversation.overallSentiment.dominant)}
                                  </span>
                                )}
                                
                                {/* Status Badge */}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  conversation.status === 'active' ? 'bg-green-100 text-green-700' :
                                  conversation.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {conversation.status === 'active' ? 'نشط' :
                                   conversation.status === 'resolved' ? 'طبيعي' : 'مؤرشف'}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                              {/* Dealt With Toggle Button */}
                              {isDealtWith(conversation._id) ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unmarkAsDealtWith(conversation._id);
                                  }}
                                  className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  تمت المعالجة
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsDealtWith(conversation._id);
                                  }}
                                  className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  وضع علامة كمعالج
                                </Button>
                              )}

                              {/* Priority indicator */}
                              {isNegative && (
                                <div className="text-xs text-red-600 font-medium">
                                  🚨 يحتاج متابعة
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>          {/* Enhanced Conversation Details */}
          <Card className="lg:col-span-2 shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle>
                {selectedConversation ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                        <span>تفاصيل المحادثة</span>
                        {hasNegativeSentiment(selectedConversation) && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium animate-pulse">
                            <AlertTriangle className="h-4 w-4" />
                            تحتاج متابعة عاجلة
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-normal text-gray-600 mt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          عميل: {selectedConversation.customerName || selectedConversation.customerId}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          المنصة: {selectedConversation.platform === 'whatsapp' ? 'واتساب' : 'ماسنجر'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(selectedConversation.startTime, 'ar')}
                        </span>
                      </div>                    </div>
                    <div className="flex items-center gap-3">
                      {/* Mark as Dealt With Button */}
                      {isDealtWith(selectedConversation._id) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unmarkAsDealtWith(selectedConversation._id)}
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          تمت المعالجة
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => markAsDealtWith(selectedConversation._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          وضع علامة كمعالج
                        </Button>
                      )}

                      {/* Overall Sentiment Badge */}
                      {selectedConversation.overallSentiment?.dominant && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${getSentimentColor(selectedConversation.overallSentiment.dominant)}`}>
                          {getSentimentIcon(selectedConversation.overallSentiment.dominant)}
                          <span className="text-sm font-medium">
                            {getSentimentLabel(selectedConversation.overallSentiment.dominant)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                    <span>اختر محادثة لعرض التفاصيل</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedConversation ? (
                <div className="space-y-6">
                  {/* Negative Messages Alert */}
                  {hasNegativeSentiment(selectedConversation) && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-bold text-red-800">تحذير: تم اكتشاف مشاعر سلبية</h4>
                      </div>
                      <p className="text-sm text-red-700">
                        هذه المحادثة تحتوي على {selectedConversation.messages.filter(m => m.sentiment?.predictedClass === 'negative').length} رسالة سلبية تتطلب اهتماماً خاصاً ومتابعة فورية من فريق خدمة العملاء.
                      </p>
                    </div>
                  )}

                  {/* Enhanced Messages Display */}
                  <div className="max-h-[500px] overflow-y-auto space-y-4 p-2"
                       style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}>
                    {selectedConversation.messages.map((message) => {
                      // Enhanced message styling with stronger visual emphasis
                      let messageClass = message.sender === 'customer' ? 'bg-gray-50' : 'bg-blue-50';
                      let borderClass = '';
                      let glowEffect = '';
                      let priorityIndicator = '';
                      
                      // Enhanced sentiment-based styling
                      if (message.sentiment?.predictedClass) {
                        const sentimentClass = message.sentiment.predictedClass;
                        if (sentimentClass === 'positive') {
                          messageClass = message.sender === 'customer' ? 'bg-green-50' : 'bg-green-100';
                          borderClass = 'border-l-4 border-green-500';
                          glowEffect = 'shadow-lg shadow-green-200/50 ring-2 ring-green-300/30';
                        } else if (sentimentClass === 'negative') {
                          messageClass = message.sender === 'customer' ? 'bg-red-50' : 'bg-red-100';
                          borderClass = 'border-l-4 border-red-500';
                          glowEffect = 'shadow-xl shadow-red-200/60 ring-2 ring-red-300/50 animate-pulse';
                          priorityIndicator = 'relative overflow-hidden';
                        } else if (sentimentClass === 'neutral') {
                          messageClass = message.sender === 'customer' ? 'bg-gray-50' : 'bg-gray-100';
                          borderClass = 'border-l-4 border-gray-400';
                          glowEffect = 'shadow-md shadow-gray-200/50 ring-1 ring-gray-300/30';
                        }
                      }
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${messageClass} ${borderClass} ${glowEffect} ${priorityIndicator} rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl`}>
                            {/* Negative message priority indicator */}
                            {message.sentiment?.predictedClass === 'negative' && (
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"></div>
                            )}
                            
                            <div className="flex items-center gap-2 mb-3">
                              {message.sender === 'customer' ? (
                                <User className="h-4 w-4 text-gray-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="text-xs font-semibold text-gray-700">
                                {message.sender === 'customer' ? 'العميل' : 'الوكيل'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(message.timestamp, 'ar')}
                              </span>
                              {message.sentiment?.predictedClass === 'negative' && (
                                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold animate-bounce">
                                  عاجل
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-900 leading-relaxed mb-3 font-medium">
                              {message.content}
                            </p>
                            
                            {message.sentiment?.predictedClass && (
                              <div className="flex items-center justify-between">
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getSentimentColor(message.sentiment.predictedClass)}`}>
                                  {getSentimentIcon(message.sentiment.predictedClass)}
                                  <span>{getSentimentLabel(message.sentiment.predictedClass)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 font-mono">
                                    {Math.round((message.sentiment.confidence || 0.5) * 100)}%
                                  </span>
                                  {message.sentiment.predictedClass === 'negative' && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Enhanced Sentiment Summary */}
                  {selectedConversation.overallSentiment && (
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        ملخص تحليل المشاعر
                      </h4>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {selectedConversation.overallSentiment.positive}
                          </div>
                          <div className="text-sm font-medium text-green-700 flex items-center justify-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            إيجابي
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-3xl font-bold text-gray-600 mb-2">
                            {selectedConversation.overallSentiment.neutral}
                          </div>
                          <div className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                            <Minus className="h-4 w-4" />
                            محايد
                          </div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm">
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {selectedConversation.overallSentiment.negative}
                          </div>
                          <div className="text-sm font-medium text-red-700 flex items-center justify-center gap-1">
                            <TrendingDown className="h-4 w-4" />
                            سلبي
                            {selectedConversation.overallSentiment.negative > 0 && (
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons for Negative Conversations */}
                      {hasNegativeSentiment(selectedConversation) && (
                        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <h5 className="font-bold text-orange-800 mb-3">إجراءات مقترحة</h5>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              تصعيد للإدارة
                            </Button>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                              <Users className="h-4 w-4 mr-2" />
                              تحويل لمختص
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              وضع علامة كمراجع
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">اختر محادثة</h3>
                  <p className="text-gray-600">اختر محادثة من القائمة لعرض تحليل المشاعر التفصيلي</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}
