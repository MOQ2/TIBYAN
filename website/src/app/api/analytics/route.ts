// API endpoint for analytics data
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') as 'whatsapp' | 'messenger' | null;
    const timeRange = searchParams.get('timeRange') || '7d'; // 7d, 30d, 90d
    const userId = searchParams.get('userId'); // For admin users to see all data

    await connectDB();

    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Build filter
    const filter: Record<string, unknown> = {
      startTime: { $gte: startDate }
    };

    if (platform) {
      filter.platform = platform;
    }

    // If not admin and no specific userId, filter by current user
    if (session.user.role !== 'admin' && !userId) {
      filter.userId = session.user.id;
    } else if (userId && session.user.role === 'admin') {
      filter.userId = userId;
    }

    // Get conversations
    const conversations = await ConversationModel.find(filter);

    // Calculate analytics
    const analytics = {
      totalConversations: conversations.length,
      platforms: {
        whatsapp: conversations.filter(c => c.platform === 'whatsapp').length,
        messenger: conversations.filter(c => c.platform === 'messenger').length
      },
      sentiment: {
        positive: 0,
        negative: 0,
        neutral: 0
      },
      status: {
        active: conversations.filter(c => c.status === 'active').length,
        resolved: conversations.filter(c => c.status === 'resolved').length,
        archived: conversations.filter(c => c.status === 'archived').length
      },
      totalMessages: 0,
      averageMessagesPerConversation: 0,
      responseTimeStats: {
        average: 0,
        fastest: 0,
        slowest: 0
      },
      dailyStats: [] as Array<{
        date: string;
        conversations: number;
        messages: number;
        sentiment: { positive: number; negative: number; neutral: number };
      }>
    };

    // Calculate sentiment totals and message counts
    conversations.forEach(conversation => {
      analytics.totalMessages += conversation.messages.length;
      
      if (conversation.overallSentiment) {
        analytics.sentiment.positive += conversation.overallSentiment.positive || 0;
        analytics.sentiment.negative += conversation.overallSentiment.negative || 0;
        analytics.sentiment.neutral += conversation.overallSentiment.neutral || 0;
      }
    });

    // Calculate average messages per conversation
    if (conversations.length > 0) {
      analytics.averageMessagesPerConversation = Math.round(
        analytics.totalMessages / conversations.length
      );
    }

    // Generate daily stats for the time range
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayConversations = conversations.filter(c => 
        c.startTime.toISOString().split('T')[0] === dateStr
      );

      const dayMessages = dayConversations.reduce((total, c) => total + c.messages.length, 0);
      
      const daySentiment = {
        positive: 0,
        negative: 0,
        neutral: 0
      };

      dayConversations.forEach(conversation => {
        if (conversation.overallSentiment) {
          daySentiment.positive += conversation.overallSentiment.positive || 0;
          daySentiment.negative += conversation.overallSentiment.negative || 0;
          daySentiment.neutral += conversation.overallSentiment.neutral || 0;
        }
      });

      analytics.dailyStats.unshift({
        date: dateStr,
        conversations: dayConversations.length,
        messages: dayMessages,
        sentiment: daySentiment
      });
    }

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' }, 
      { status: 500 }
    );
  }
}
