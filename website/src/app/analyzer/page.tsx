'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Conversation } from '@/types';
import { formatDate, getSentimentColor } from '@/lib/utils';

export default function ConversationAnalyzerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      
      console.log('Conversations API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Conversations API data:', data);
        setConversations(data.conversations || []);
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
  };
  // Load conversations on mount
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

    const loadData = async () => {
      console.log('Analyzer: Loading conversations...');
      const success = await fetchConversations();
      setIsLoading(false);
      console.log('Analyzer: Load complete, success:', success);
    };

    loadData();
  }, [session, status, router]);

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

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const customerName = conv.customerName || conv.customerId;
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">محلل المحادثات</h1>
            <p className="text-gray-600">تحليل المشاعر للمحادثات المباشرة</p>
          </div>
          <Button 
            onClick={refreshConversations} 
            disabled={isRefreshing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <RefreshCw className="h-4 w-4 ml-2" />
            )}
            تحديث
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>المحادثات ({filteredConversations.length})</span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في المحادثات..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>لا توجد محادثات</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?._id === conversation._id ? 'bg-green-50 border-r-4 border-r-green-500' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {conversation.customerName || conversation.customerId}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              conversation.platform === 'whatsapp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {conversation.platform === 'whatsapp' ? 'واتساب' : 'ماسنجر'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {conversation.messages[0]?.content || 'لا توجد رسائل'}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatDate(conversation.endTime || conversation.startTime, 'ar')}
                            </span>
                            {conversation.overallSentiment?.dominant && (
                              <span className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(conversation.overallSentiment.dominant)}`}>
                                {getSentimentLabel(conversation.overallSentiment.dominant)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversation Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span>تفاصيل المحادثة</span>
                      <div className="text-sm font-normal text-gray-600 mt-1">
                        عميل: {selectedConversation.customerName || selectedConversation.customerId} • 
                        المنصة: {selectedConversation.platform === 'whatsapp' ? 'واتساب' : 'ماسنجر'}
                      </div>
                    </div>
                    {selectedConversation.overallSentiment?.dominant && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getSentimentColor(selectedConversation.overallSentiment.dominant)}`}>
                        {getSentimentIcon(selectedConversation.overallSentiment.dominant)}
                        <span className="text-sm font-medium">
                          {getSentimentLabel(selectedConversation.overallSentiment.dominant)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  'اختر محادثة لعرض التفاصيل'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedConversation ? (
                <div className="space-y-4">                  {/* Messages */}
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {selectedConversation.messages.map((message) => {
                      // Determine message background color based on sentiment
                      let messageClass = message.sender === 'customer' ? 'bg-gray-100' : 'bg-green-100';
                      
                      // Add sentiment-based coloring
                      if (message.sentiment) {
                        const sentimentClass = message.sentiment.predictedClass || message.sentiment;
                        if (sentimentClass === 'positive') {
                          messageClass = message.sender === 'customer' ? 'bg-green-50 border-l-4 border-green-400' : 'bg-green-100 border-l-4 border-green-500';
                        } else if (sentimentClass === 'negative') {
                          messageClass = message.sender === 'customer' ? 'bg-red-50 border-l-4 border-red-400' : 'bg-red-100 border-l-4 border-red-500';
                        } else if (sentimentClass === 'neutral') {
                          messageClass = message.sender === 'customer' ? 'bg-gray-50 border-l-4 border-gray-400' : 'bg-gray-100 border-l-4 border-gray-500';
                        }
                      }
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${messageClass} rounded-lg p-3`}>
                            <div className="flex items-center gap-2 mb-1">
                              {message.sender === 'customer' ? (
                                <User className="h-4 w-4 text-gray-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-green-600" />
                              )}
                              <span className="text-xs font-medium">
                                {message.sender === 'customer' ? 'العميل' : 'الوكيل'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(message.timestamp, 'ar')}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.sentiment && (
                              <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getSentimentColor(message.sentiment.predictedClass || message.sentiment)}`}>
                                {getSentimentIcon(message.sentiment.predictedClass || message.sentiment)}
                                <span>{getSentimentLabel(message.sentiment.predictedClass || message.sentiment)}</span>
                                <span className="text-xs opacity-75">
                                  ({Math.round((message.sentiment.confidence || 0.5) * 100)}%)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sentiment Summary */}
                  {selectedConversation.overallSentiment && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedConversation.overallSentiment.positive}
                        </div>
                        <div className="text-sm text-gray-600">إيجابي</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {selectedConversation.overallSentiment.neutral}
                        </div>
                        <div className="text-sm text-gray-600">محايد</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {selectedConversation.overallSentiment.negative}
                        </div>
                        <div className="text-sm text-gray-600">سلبي</div>
                      </div>
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
