// Facebook Messenger API webhook handler
import { NextRequest, NextResponse } from 'next/server';
import { MessageProcessor } from '@/lib/services/messageProcessor';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook (required by Facebook)
  if (mode === 'subscribe' && token === process.env.MESSENGER_VERIFY_TOKEN) {
    console.log('Messenger webhook verified');
    return new NextResponse(challenge);
  }

  console.log('Messenger webhook verification failed:', { mode, token: token?.substring(0, 8) + '...' });
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process incoming Messenger messages
    if (body.object === 'page') {
      for (const entry of body.entry) {
        const messaging = entry.messaging;
        
        if (messaging) {
          for (const event of messaging) {
            if (event.message) {
              await processMessengerMessage(event);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Messenger webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

interface MessengerSender {
  id: string;
}

interface MessengerRecipient {
  id: string;
}

interface MessengerAttachment {
  type: string;
  payload: {
    url?: string;
    sticker_id?: string;
  };
}

interface MessengerMessage {
  mid: string;
  text?: string;
  attachments?: MessengerAttachment[];
  quick_reply?: {
    payload: string;
  };
}

interface MessengerEvent {
  sender: MessengerSender;
  recipient: MessengerRecipient;
  timestamp: number;
  message: MessengerMessage;
}

async function processMessengerMessage(event: MessengerEvent) {
  try {
    // Extract message content
    let content = '';
    let messageType: 'text' | 'image' | 'audio' | 'document' = 'text';

    if (event.message.text) {
      content = event.message.text;
      messageType = 'text';
    } else if (event.message.attachments && event.message.attachments.length > 0) {
      const attachment = event.message.attachments[0];
      switch (attachment.type) {
        case 'image':
          content = '[Image]';
          messageType = 'image';
          break;
        case 'audio':
          content = '[Audio Message]';
          messageType = 'audio';
          break;
        case 'file':
          content = '[Document]';
          messageType = 'document';
          break;
        default:
          content = `[${attachment.type}]`;
          break;
      }
    } else if (event.message.quick_reply) {
      content = event.message.quick_reply.payload;
      messageType = 'text';
    } else {
      content = '[Unknown message type]';
    }

    // Process message through MessageProcessor
    const conversation = await MessageProcessor.processMessage({
      platform: 'messenger',
      messageId: event.message.mid,
      customerId: event.sender.id,
      customerName: undefined, // Messenger doesn't provide name in webhook
      content,
      messageType,
      timestamp: new Date(event.timestamp),
      sender: 'customer', // Messages from Messenger webhook are always from customers
      metadata: {
        recipientId: event.recipient.id,
        originalEvent: event
      }
    });

    if (conversation) {
      console.log(`Messenger message processed successfully:`, {
        conversationId: conversation._id,
        customerId: event.sender.id,
        messageType,
        sentiment: conversation.messages[conversation.messages.length - 1]?.sentiment?.predictedClass
      });

      // TODO: Implement real-time notifications here
      // Example: Send to WebSocket, push notifications, etc.
    }

  } catch (error) {
    console.error('Error processing Messenger message:', error);
    // Don't throw error to avoid webhook retry loops
  }
}
