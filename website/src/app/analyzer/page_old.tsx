'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Bot,
  Download,
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
import { Conversation, ConversationMessage } from '@/types';
import { formatDate, getSentimentColor, formatConfidence } from '@/lib/utils';

export default function ConversationAnalyzerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations?limit=50');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        return true;
      } else {
        console.log('Failed to fetch conversations, using mock data');
        return false;
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return false;
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const loadData = async () => {
      const success = await fetchConversations();
      if (!success) {
        // Use mock data as fallback
        setConversations(mockConversations);
      }
      setIsLoading(false);
    };

    loadData();
  }, [session, status, router]);

  // Refresh conversations
  const refreshConversations = async () => {
    setIsRefreshing(true);
    await fetchConversations();
    setIsRefreshing(false);
  };
  const [loading, setLoading] = useState(true);
  // Load conversations on mount
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const loadData = async () => {
      const success = await fetchConversations();
      if (!success) {
        // If API fails, set empty array - no mock data for now
        setConversations([]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [session, status, router]);

  // Refresh conversations
  const refreshConversations = async () => {
    setIsRefreshing(true);
    await fetchConversations();
    setIsRefreshing(false);
  };

  // Check if a specific conversation is requested
  useEffect(() => {
    const fileId = searchParams.get('file');
    if (fileId && conversations.length > 0) {
      const conversation = conversations.find(c => c._id === fileId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 border-green-200 text-green-800';
      case 'negative': return 'bg-red-100 border-red-200 text-red-800';
      case 'neutral': return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

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
  };  const getPlatformIcon = () => {
    // In a real app, you'd use actual platform icons
    return <MessageSquare className="h-4 w-4" />;
  };

  const filteredConversations = conversations.filter(conv => {
    const customerName = conv.customerName || conv.customerId;
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Get dominant sentiment for filtering
    const dominantSentiment = conv.overallSentiment?.dominant;
    const matchesSentiment = sentimentFilter === 'all' || dominantSentiment === sentimentFilter;
    
    return matchesSearch && matchesSentiment;
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Sidebar>
      <main className="flex-1 overflow-hidden" dir="rtl">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-l border-gray-200 bg-white overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                محلل المحادثات
              </h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في المحادثات..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filter */}
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value as 'all' | 'positive' | 'negative' | 'neutral')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع المشاعر</option>
                <option value="positive">إيجابي</option>
                <option value="negative">سلبي</option>
                <option value="neutral">محايد</option>
              </select>
            </div>
            
            {/* Conversations */}
            <div className="space-y-2 p-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  } border`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{conversation.customerName}</h3>
                    <div className="flex items-center gap-1">
                      {getPlatformIcon()}
                      <span className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(conversation.overallSentiment)}`}>
                        {getSentimentLabel(conversation.overallSentiment)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.messages[0]?.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{conversation.agentName}</span>
                    <span>{conversation.startTime.toLocaleTimeString('ar')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Detail */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedConversation.customerName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        وكيل: {selectedConversation.agentName} • 
                        {selectedConversation.startTime.toLocaleDateString('ar')} • 
                        {selectedConversation.messages.length} رسالة
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getSentimentColor(selectedConversation.overallSentiment)}`}>
                        {getSentimentIcon(selectedConversation.overallSentiment)}
                        <span className="text-sm font-medium">
                          {getSentimentLabel(selectedConversation.overallSentiment)}
                        </span>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        تصدير
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-2 mt-3">
                    {selectedConversation.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-lg border ${getSentimentColor(message.sentiment)}`}>
                            <p className="text-sm">{message.text}</p>
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <div className="flex items-center gap-2">
                                {getSentimentIcon(message.sentiment)}
                                <span>{getSentimentLabel(message.sentiment)}</span>
                                <span className="text-gray-500">
                                  ({(message.confidence * 100).toFixed(0)}%)
                                </span>
                              </div>
                              <span className="text-gray-500">
                                {message.timestamp.toLocaleTimeString('ar')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex-shrink-0 ${message.sender === 'customer' ? 'order-1' : 'order-2'}`}>
                          {message.sender === 'customer' ? (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">ملخص التحليل</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {selectedConversation.messages.filter(m => m.sentiment === 'positive').length}
                          </div>
                          <div className="text-xs text-gray-600">رسائل إيجابية</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-600">
                            {selectedConversation.messages.filter(m => m.sentiment === 'neutral').length}
                          </div>
                          <div className="text-xs text-gray-600">رسائل محايدة</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">
                            {selectedConversation.messages.filter(m => m.sentiment === 'negative').length}
                          </div>
                          <div className="text-xs text-gray-600">رسائل سلبية</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    اختر محادثة للتحليل
                  </h3>
                  <p className="text-gray-600">
                    اختر محادثة من القائمة لرؤية التحليل التفصيلي للمشاعر
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
