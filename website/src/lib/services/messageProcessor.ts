// Message Processing Service for WhatsApp and Messenger
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';
import { SentimentService } from './sentiment';
import { ConversationMessage, Conversation } from '@/types';

interface ProcessMessageRequest {
  platform: 'whatsapp' | 'messenger';
  messageId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  content: string;
  messageType?: 'text' | 'image' | 'audio' | 'document';
  timestamp: Date;
  sender: 'customer' | 'agent';
  metadata?: Record<string, unknown>;
}

export class MessageProcessor {
  /**
   * Process incoming message from WhatsApp or Messenger
   * - Analyze sentiment
   * - Find or create conversation
   * - Store message in database
   * - Update conversation statistics
   */
  static async processMessage(request: ProcessMessageRequest): Promise<Conversation | null> {
    try {
      await connectDB();
      
      // Skip sentiment analysis for non-text messages or empty content
      let sentiment = undefined;
      if (request.messageType === 'text' && request.content.trim()) {
        try {
          const sentimentResult = await SentimentService.analyzeSentiment({
            text: request.content,
            language: 'ar', // Default to Arabic
            platform: request.platform
          });
          
          sentiment = {
            predictedClass: sentimentResult.sentiment,
            confidence: sentimentResult.confidence
          };
        } catch (error) {
          console.error('Sentiment analysis failed:', error);
          // Continue without sentiment if analysis fails
        }
      }

      // Create message object
      const message: ConversationMessage = {
        id: request.messageId,
        content: request.content,
        sender: request.sender,
        timestamp: request.timestamp,
        sentiment,
        messageType: request.messageType || 'text'
      };

      // Find existing conversation or create new one
      let conversation = await ConversationModel.findOne({
        customerId: request.customerId,
        platform: request.platform,
        status: { $in: ['active'] }
      }).sort({ startTime: -1 });

      if (conversation) {
        // Add message to existing conversation
        conversation.messages.push(message);
        conversation.endTime = request.timestamp;
        
        // Update customer info if provided
        if (request.customerName && !conversation.customerName) {
          conversation.customerName = request.customerName;
        }
        if (request.customerPhone && !conversation.customerPhone) {
          conversation.customerPhone = request.customerPhone;
        }
      } else {
        // Create new conversation
        conversation = new ConversationModel({
          userId: 'system', // TODO: Map to actual agent/user
          platform: request.platform,
          customerId: request.customerId,
          customerName: request.customerName,
          customerPhone: request.customerPhone,
          messages: [message],
          startTime: request.timestamp,
          endTime: request.timestamp,
          status: 'active'
        });
      }

      // Update sentiment summary
      this.updateSentimentSummary(conversation);

      // Save conversation
      const savedConversation = await conversation.save();
      
      console.log(`Message processed successfully:`, {
        conversationId: savedConversation._id,
        platform: request.platform,
        customerId: request.customerId,
        messageCount: savedConversation.messages.length,
        sentiment: sentiment?.predictedClass
      });

      return savedConversation.toJSON() as Conversation;
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
  /**
   * Update conversation sentiment summary based on all messages
   */
  private static updateSentimentSummary(conversation: InstanceType<typeof ConversationModel>) {
    const sentimentCounts = {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    // Count sentiments from all messages
    conversation.messages.forEach((msg: ConversationMessage) => {
      if (msg.sentiment?.predictedClass) {
        sentimentCounts[msg.sentiment.predictedClass]++;
      }
    });

    const totalWithSentiment = sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral;
    
    if (totalWithSentiment > 0) {
      // Find dominant sentiment
      const dominant = Object.entries(sentimentCounts).reduce((a, b) => 
        sentimentCounts[a[0] as keyof typeof sentimentCounts] > sentimentCounts[b[0] as keyof typeof sentimentCounts] ? a : b
      )[0] as 'positive' | 'negative' | 'neutral';

      conversation.overallSentiment = {
        positive: sentimentCounts.positive,
        negative: sentimentCounts.negative,
        neutral: sentimentCounts.neutral,
        dominant,
        totalMessages: conversation.messages.length
      };
    }
  }

  /**
   * Mark conversation as resolved
   */
  static async resolveConversation(conversationId: string): Promise<Conversation | null> {
    try {
      await connectDB();
      
      const conversation = await ConversationModel.findByIdAndUpdate(
        conversationId,
        { 
          status: 'resolved',
          endTime: new Date()
        },
        { new: true }
      );

      return conversation?.toJSON() as Conversation || null;
    } catch (error) {
      console.error('Error resolving conversation:', error);
      throw error;
    }
  }

  /**
   * Get active conversations for a platform
   */
  static async getActiveConversations(platform?: 'whatsapp' | 'messenger'): Promise<Conversation[]> {
    try {
      await connectDB();
      
      const filter: Record<string, unknown> = { status: 'active' };
      if (platform) {
        filter.platform = platform;
      }

      const conversations = await ConversationModel
        .find(filter)
        .sort({ endTime: -1 })
        .limit(50); // Limit for performance

      return conversations.map(conv => conv.toJSON()) as Conversation[];
    } catch (error) {
      console.error('Error getting active conversations:', error);
      return [];
    }
  }

  /**
   * Search conversations by customer ID or phone
   */
  static async searchConversations(query: string, platform?: 'whatsapp' | 'messenger'): Promise<Conversation[]> {
    try {
      await connectDB();
      
      const filter: Record<string, unknown> = {
        $or: [
          { customerId: { $regex: query, $options: 'i' } },
          { customerName: { $regex: query, $options: 'i' } },
          { customerPhone: { $regex: query, $options: 'i' } }
        ]
      };

      if (platform) {
        filter.platform = platform;
      }

      const conversations = await ConversationModel
        .find(filter)
        .sort({ endTime: -1 })
        .limit(20);

      return conversations.map(conv => conv.toJSON()) as Conversation[];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }
}
