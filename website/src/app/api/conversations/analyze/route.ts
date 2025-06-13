import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    await connectDB();    const query: Record<string, string> = { userId: session.user.email };
    if (fileId) {
      query.fileUploadId = fileId;
    }

    // Get conversations for the current user
    const conversations = await ConversationModel.find(query)
      .sort({ startTime: -1 })
      .limit(50); // Limit to prevent large responses

    const formattedConversations = conversations.map(conv => ({
      id: conv._id.toString(),
      conversationId: conv.conversationId,
      platform: conv.platform,
      customerName: conv.customerName,
      customerPhone: conv.customerPhone,
      agentName: conv.agentName,
      startTime: conv.startTime,
      endTime: conv.endTime,
      status: conv.status,
      tags: conv.tags,
      messageCount: conv.messages.length,      sentimentSummary: {
        positive: conv.messages.filter((m: any) => m.sentiment === 'positive').length,
        negative: conv.messages.filter((m: any) => m.sentiment === 'negative').length,
        neutral: conv.messages.filter((m: any) => m.sentiment === 'neutral').length
      },      messages: conv.messages.map((msg: any) => ({
        id: msg.id,
        timestamp: msg.timestamp,
        sender: msg.sender,
        content: msg.content,
        sentiment: msg.sentiment,
        confidence: msg.confidence,
        language: msg.language
      }))
    }));

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
      total: formattedConversations.length
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch conversations' 
    }, { status: 500 });
  }
}
