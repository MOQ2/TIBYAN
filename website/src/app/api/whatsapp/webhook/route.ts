// WhatsApp Business API webhook handler
import { NextRequest, NextResponse } from 'next/server';
import { MessageProcessor } from '@/lib/services/messageProcessor';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook (required by WhatsApp)
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    return new NextResponse(challenge);
  }

  console.log('WhatsApp webhook verification failed:', { mode, token: token?.substring(0, 8) + '...' });
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process incoming WhatsApp messages
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            
            if (messages) {
              for (const message of messages) {
                await processWhatsAppMessage(message, change.value);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio' | 'document' | 'video';
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  audio?: { id: string; mime_type: string };
  document?: { id: string; filename: string; mime_type: string };
}

interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string;
  contacts?: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
}

async function processWhatsAppMessage(message: WhatsAppMessage, metadata: WhatsAppMetadata) {
  try {
    // Extract message content based on type
    let content = '';
    let messageType: 'text' | 'image' | 'audio' | 'document' = 'text';

    switch (message.type) {
      case 'text':
        content = message.text?.body || '';
        messageType = 'text';
        break;
      case 'image':
        content = message.image?.caption || '[Image]';
        messageType = 'image';
        break;
      case 'audio':
        content = '[Audio Message]';
        messageType = 'audio';
        break;
      case 'document':
        content = `[Document: ${message.document?.filename || 'Unknown'}]`;
        messageType = 'document';
        break;
      default:
        content = `[${message.type} message]`;
        break;
    }

    // Get customer name from contacts if available
    const customerContact = metadata.contacts?.find(contact => contact.wa_id === message.from);
    const customerName = customerContact?.profile?.name;

    // Process message through MessageProcessor
    const conversation = await MessageProcessor.processMessage({
      platform: 'whatsapp',
      messageId: message.id,
      customerId: message.from,
      customerName,
      customerPhone: message.from,
      content,
      messageType,
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      sender: 'customer', // WhatsApp messages from customers are always from customers
      metadata: {
        phoneNumberId: metadata.phone_number_id,
        displayPhoneNumber: metadata.display_phone_number,
        originalMessage: message
      }
    });

    if (conversation) {
      console.log(`WhatsApp message processed successfully:`, {
        conversationId: conversation._id,
        customerId: message.from,
        customerName,
        messageType,
        sentiment: conversation.messages[conversation.messages.length - 1]?.sentiment?.predictedClass
      });

      // TODO: Implement real-time notifications here
      // Example: Send to WebSocket, push notifications, etc.
    }

  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    // Don't throw error to avoid webhook retry loops
  }
}
