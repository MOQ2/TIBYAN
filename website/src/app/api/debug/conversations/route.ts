// Temporary debug endpoint to check conversations in database
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';

export async function GET() {
  try {
    await connectDB();
    
    const allConversations = await ConversationModel.find({}).lean();
    
    console.log('Debug: Total conversations in database:', allConversations.length);
    
    const conversationsByUser = allConversations.reduce((acc, conv: any) => {
      const userId = conv.userId || 'unknown';
      if (!acc[userId]) acc[userId] = 0;
      acc[userId]++;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Debug: Conversations by user:', conversationsByUser);
      return NextResponse.json({
      total: allConversations.length,
      byUser: conversationsByUser,
      conversations: allConversations.map((conv: any) => ({
        id: conv._id.toString(),
        conversationId: conv.conversationId,
        userId: conv.userId,
        customerName: conv.customerName,
        platform: conv.platform,
        messageCount: conv.messages?.length || 0,        sampleMessage: conv.messages?.[0] ? {
          id: conv.messages[0].id,
          content: conv.messages[0].content?.substring(0, 50) + '...',
          sender: conv.messages[0].sender,
          sentiment: conv.messages[0].sentiment,
          confidence: conv.messages[0].confidence
        } : null,
        allMessageSentiments: conv.messages?.map((msg: any) => ({
          sender: msg.sender,
          sentiment: msg.sentiment,
          confidence: msg.confidence
        })) || []
      }))
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Failed to get debug info' }, { status: 500 });
  }
}
