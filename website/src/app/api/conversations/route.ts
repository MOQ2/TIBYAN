// API endpoint to get conversations with real database data
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Conversations API: No authenticated session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Conversations API: Authenticated user:', session.user.email);

    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') as 'whatsapp' | 'messenger' | null;
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    await connectDB();

    // Build query based on filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { userId: session.user.email };
    
    if (platform) {
      query.platform = platform;
    }
    
    if (status && status !== 'active') {
      query.status = status;
    }

    console.log('Conversations API: Query:', query);

    // Get conversations from database
    const totalCount = await ConversationModel.countDocuments(query);
    console.log('Conversations API: Total count:', totalCount);
    
    const conversations = await ConversationModel.find(query)
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    console.log('Conversations API: Found conversations:', conversations.length);    // Format conversations for the frontend
    const formattedConversations = conversations.map(conv => {
      // Calculate sentiment summary from messages
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages = (conv as any).messages || [];
      
      console.log('Processing conversation with', messages.length, 'messages');
      
      // Count sentiments with better logic to handle different sentiment formats
      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;
      
      messages.forEach((msg: any, index: number) => {
        const sentiment = msg.sentiment || msg.sentimentClass || 'neutral';
        console.log(`Message ${index + 1}: sentiment = "${sentiment}"`);
        
        if (sentiment === 'positive') {
          positiveCount++;
        } else if (sentiment === 'negative') {
          negativeCount++;
        } else {
          neutralCount++;
        }
      });
      
      const sentimentSummary = {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount
      };
      
      console.log('Sentiment summary:', sentimentSummary);

      // Determine dominant sentiment
      const maxSentiment = Object.entries(sentimentSummary).reduce((a, b) => 
        sentimentSummary[a[0] as keyof typeof sentimentSummary] > sentimentSummary[b[0] as keyof typeof sentimentSummary] ? a : b
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convData = conv as any;
      
      return {
        _id: convData._id.toString(),
        conversationId: convData.conversationId,
        customerId: convData.customerPhone || convData.conversationId,
        customerName: convData.customerName,
        customerPhone: convData.customerPhone,
        agentName: convData.agentName,
        platform: convData.platform,
        startTime: convData.startTime,
        endTime: convData.endTime,
        status: convData.status,
        tags: convData.tags,        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: messages.map((msg: any) => {
          const sentiment = msg.sentiment || msg.sentimentClass;
          const confidence = msg.confidence || 0.5;
          
          return {
            id: msg.id,
            timestamp: msg.timestamp,
            sender: msg.sender,
            content: msg.content,
            sentiment: sentiment ? sentiment : undefined,
            confidence: confidence,
            language: msg.language
          };
        }),
        overallSentiment: {
          positive: sentimentSummary.positive,
          negative: sentimentSummary.negative,
          neutral: sentimentSummary.neutral,
          dominant: maxSentiment[0] as 'positive' | 'negative' | 'neutral'
        }
      };
    });

    return NextResponse.json({
      conversations: formattedConversations,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, action } = body;

    if (!conversationId || !action) {
      return NextResponse.json(
        { error: 'Missing conversationId or action' }, 
        { status: 400 }
      );
    }

    await connectDB();

    switch (action) {
      case 'resolve':
        const conversation = await ConversationModel.findOneAndUpdate(
          { 
            conversationId, 
            userId: session.user.email 
          },
          { status: 'resolved' },
          { new: true }
        );
        
        if (!conversation) {
          return NextResponse.json(
            { error: 'Conversation not found' }, 
            { status: 404 }
          );
        }
        return NextResponse.json({ conversation });

      default:
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' }, 
      { status: 500 }
    );
  }
}
