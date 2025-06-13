// API endpoint to search conversations
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { MessageProcessor } from '@/lib/services/messageProcessor';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const platform = searchParams.get('platform') as 'whatsapp' | 'messenger' | null;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const conversations = await MessageProcessor.searchConversations(
      query, 
      platform || undefined
    );

    return NextResponse.json({
      conversations,
      query,
      count: conversations.length
    });

  } catch (error) {
    console.error('Error searching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to search conversations' }, 
      { status: 500 }
    );
  }
}
