import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { FileUploadModel } from '@/lib/models/FileUpload';
import { ConversationModel } from '@/lib/models/Conversation';
import { SentimentService } from '@/lib/services/sentiment';

interface ConversationData {
  conversation?: {
    id: string;
    platform: string;
    customer: {
      id: string;
      name: string;
      phone?: string;
    };
    agent?: {
      id: string;
      name: string;
    };
    startTime: string;
    endTime?: string;
    status?: string;
    tags?: string[];
    messages: Array<{
      id: string;
      timestamp: string;
      sender: 'customer' | 'agent';
      content: string;
      type: string;
      language: string;
    }>;
  };
  conversations?: Array<{
    id: string;
    platform: string;
    customer: {
      id: string;
      name: string;
      phone?: string;
    };
    agent?: {
      id: string;
      name: string;
    };
    startTime: string;
    endTime?: string;
    status?: string;
    tags?: string[];
    messages: Array<{
      id: string;
      timestamp: string;
      sender: 'customer' | 'agent';
      content: string;
      type: string;
      language: string;
    }>;
  }>;
}

async function parseFileContent(file: File): Promise<ConversationData> {
  const content = await file.text();
  
  if (file.type === 'application/json' || file.name.endsWith('.json')) {
    try {
      return JSON.parse(content) as ConversationData;
    } catch {
      throw new Error('Invalid JSON format');
    }
  }
  
  // For CSV and TXT files, create a simple conversation structure
  if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const lines = content.split('\n').filter(line => line.trim());
    
    const conversation = {
      id: `file-conv-${Date.now()}`,
      platform: 'whatsapp' as const,
      customer: {
        id: 'file-customer',
        name: 'File Upload Customer'
      },
      agent: {
        id: 'file-agent',
        name: 'File Upload Agent'
      },
      startTime: new Date().toISOString(),
      status: 'resolved',
      tags: ['file-import'],
      messages: lines.map((line, index) => ({
        id: `file-msg-${index}`,
        timestamp: new Date(Date.now() + index * 1000).toISOString(),
        sender: (index % 2 === 0 ? 'customer' : 'agent') as 'customer' | 'agent',
        content: line.trim(),
        type: 'text',
        language: 'ar'
      }))
    };
    
    return { conversation };
  }
  
  throw new Error('Unsupported file type');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/json', 'text/csv', 'text/plain'];
    const allowedExtensions = ['.json', '.csv', '.txt'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.endsWith(ext))) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JSON, CSV, and TXT files are allowed.' 
      }, { status: 400 });
    }

    // Parse file content
    let conversationData: ConversationData;
    try {
      conversationData = await parseFileContent(file);
    } catch (parseError) {
      return NextResponse.json({ 
        error: parseError instanceof Error ? parseError.message : 'Failed to parse file'
      }, { status: 400 });
    }
    
    // Connect to database (with fallback for demo mode)
    let useRealDB = true;
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('MongoDB connection failed, using demo mode:', dbError);
      useRealDB = false;
    }

    if (!useRealDB) {
      // Demo mode - return mock results
      const mockConversations = conversationData.conversations || (conversationData.conversation ? [conversationData.conversation] : []);
      return NextResponse.json({
        success: true,
        fileId: `demo-${Date.now()}`,
        conversationsCount: mockConversations.length,
        sentimentSummary: {
          positive: Math.floor(mockConversations.length * 0.6),
          negative: Math.floor(mockConversations.length * 0.2),
          neutral: Math.floor(mockConversations.length * 0.2)
        }
      });
    }    // Real database mode
    const fileUpload = new FileUploadModel({
      userId: session.user.email,
      filename: file.name,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      uploadDate: new Date(),
      status: 'processing'
    });
    
    await fileUpload.save();

    // Process conversations
    const conversations = conversationData.conversations || (conversationData.conversation ? [conversationData.conversation] : []);
    let processedConversations = 0;
    let totalPositive = 0;
    let totalNegative = 0;
    let totalNeutral = 0;

    for (const convData of conversations) {
      try {
        // Analyze sentiment for each message
        const analyzedMessages = [];
        
        for (const message of convData.messages) {
          if (message.content && message.content.trim()) {            let sentiment;
            try {
              // Try to use FastAPI sentiment analysis service
              sentiment = await SentimentService.analyzeSentiment({
                text: message.content,
                language: (message.language as 'ar' | 'en') || 'ar'
              });
              console.log(`Sentiment analysis for "${message.content.substring(0, 50)}...": ${sentiment.sentiment} (${sentiment.confidence})`);
            } catch (sentimentError) {
              console.warn('FastAPI sentiment analysis failed, using fallback:', sentimentError);
              // Fallback sentiment analysis using keywords
              const text = message.content.toLowerCase();
              if (text.includes('شكرا') || text.includes('ممتاز') || text.includes('رائع') || text.includes('جيد') || text.includes('أشكرك')) {
                sentiment = { sentiment: 'positive' as const, confidence: 0.8 };
              } else if (text.includes('مشكلة') || text.includes('سيء') || text.includes('لا يعمل') || text.includes('خطأ') || text.includes('مزعج')) {
                sentiment = { sentiment: 'negative' as const, confidence: 0.8 };
              } else {
                sentiment = { sentiment: 'neutral' as const, confidence: 0.6 };
              }
            }
              analyzedMessages.push({
              id: message.id,
              timestamp: new Date(message.timestamp),
              sender: message.sender,
              content: message.content,
              type: message.type || 'text',
              language: message.language || 'ar',
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence
            });
            
            // Count sentiments
            if (sentiment.sentiment === 'positive') totalPositive++;
            else if (sentiment.sentiment === 'negative') totalNegative++;
            else totalNeutral++;
          } else {            analyzedMessages.push({
              id: message.id,
              timestamp: new Date(message.timestamp),
              sender: message.sender,
              content: message.content,
              type: message.type || 'text',
              language: message.language || 'ar',
              sentiment: 'neutral' as const,
              confidence: 0.5
            });
            totalNeutral++;
          }
        }

        // Save conversation to database
        const conversation = new ConversationModel({
          conversationId: convData.id,
          platform: convData.platform,
          customerId: convData.customer.id,
          customerName: convData.customer.name,
          customerPhone: convData.customer.phone,
          agentId: convData.agent?.id,
          agentName: convData.agent?.name,
          messages: analyzedMessages,
          startTime: new Date(convData.startTime),
          endTime: convData.endTime ? new Date(convData.endTime) : new Date(),
          status: (convData.status as 'active' | 'resolved' | 'archived') || 'resolved',
          tags: convData.tags || [],
          userId: session.user.email,
          fileUploadId: fileUpload._id
        });

        await conversation.save();
        processedConversations++;
        
      } catch (error) {
        console.error(`Error processing conversation ${convData.id}:`, error);
      }
    }

    // Update file upload status
    fileUpload.status = 'completed';
    fileUpload.conversationsCount = processedConversations;
    fileUpload.sentimentSummary = {
      positive: totalPositive,
      negative: totalNegative,
      neutral: totalNeutral
    };
    fileUpload.processedAt = new Date();
    
    await fileUpload.save();

    return NextResponse.json({
      success: true,
      fileId: fileUpload._id.toString(),
      conversationsCount: processedConversations,
      sentimentSummary: {
        positive: totalPositive,
        negative: totalNegative,
        neutral: totalNeutral
      }
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}
