// API endpoint for analytics data
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';
import { ConversationMessage } from '@/types';

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
    const conversations = await ConversationModel.find(filter);    // Calculate analytics with REAL data only
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
    };    const responseTimes: number[] = [];

    // Calculate REAL sentiment totals and message counts from individual messages
    conversations.forEach(conversation => {
      analytics.totalMessages += conversation.messages.length;
        // Calculate sentiment from INDIVIDUAL MESSAGES (real data)
      conversation.messages.forEach((message: ConversationMessage) => {
        if (message.sentiment?.predictedClass) {
          switch (message.sentiment.predictedClass) {
            case 'positive':
              analytics.sentiment.positive++;
              break;
            case 'negative':
              analytics.sentiment.negative++;
              break;
            case 'neutral':
              analytics.sentiment.neutral++;
              break;
          }
        }
      });

      // Calculate REAL response times between customer and agent messages
      const customerMessages = conversation.messages.filter((m: ConversationMessage) => m.sender === 'customer');
      const agentMessages = conversation.messages.filter((m: ConversationMessage) => m.sender === 'agent');
      
      customerMessages.forEach((customerMsg: ConversationMessage) => {
        // Find the next agent response after this customer message
        const nextAgentResponse = agentMessages.find((agentMsg: ConversationMessage) => 
          agentMsg.timestamp > customerMsg.timestamp
        );
        
        if (nextAgentResponse) {
          const responseTime = nextAgentResponse.timestamp.getTime() - customerMsg.timestamp.getTime();
          responseTimes.push(responseTime / (1000 * 60)); // Convert to minutes
        }
      });
    });

    // Calculate REAL response time statistics
    if (responseTimes.length > 0) {
      analytics.responseTimeStats.average = Math.round(
        responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      );
      analytics.responseTimeStats.fastest = Math.round(Math.min(...responseTimes));
      analytics.responseTimeStats.slowest = Math.round(Math.max(...responseTimes));
    }

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

      // Calculate REAL daily sentiment from individual messages
      dayConversations.forEach(conversation => {
        conversation.messages.forEach((message: ConversationMessage) => {
          if (message.sentiment?.predictedClass) {
            switch (message.sentiment.predictedClass) {
              case 'positive':
                daySentiment.positive++;
                break;
              case 'negative':
                daySentiment.negative++;
                break;
              case 'neutral':
                daySentiment.neutral++;
                break;
            }
          }
        });
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
