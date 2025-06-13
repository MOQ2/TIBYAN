# TIBYAN - File Upload JSON Format Guide

## 📄 Supported File Formats

The TIBYAN platform supports uploading conversation files in the following formats:
- **CSV** - Comma-separated values
- **TXT** - Plain text conversations
- **JSON** - Structured conversation data (recommended)

## 📋 JSON Format Specification

### **Single Conversation Format**

```json
{
  "conversation": {
    "id": "unique-conversation-id",
    "platform": "whatsapp",
    "customer": {
      "id": "customer-phone-or-id",
      "name": "Customer Name",
      "phone": "+1234567890"
    },
    "agent": {
      "id": "agent-id",
      "name": "Agent Name"
    },
    "startTime": "2024-01-15T10:30:00Z",
    "endTime": "2024-01-15T11:15:00Z",
    "status": "resolved",
    "tags": ["customer-support", "billing-inquiry"],
    "messages": [
      {
        "id": "msg-1",
        "timestamp": "2024-01-15T10:30:00Z",
        "sender": "customer",
        "content": "مرحبا، لدي استفسار عن الفاتورة",
        "type": "text",
        "language": "ar"
      },
      {
        "id": "msg-2", 
        "timestamp": "2024-01-15T10:31:00Z",
        "sender": "agent",
        "content": "أهلاً وسهلاً، كيف يمكنني مساعدتك؟",
        "type": "text",
        "language": "ar"
      },
      {
        "id": "msg-3",
        "timestamp": "2024-01-15T10:32:00Z",
        "sender": "customer", 
        "content": "شكراً لك، الخدمة ممتازة",
        "type": "text",
        "language": "ar"
      }
    ]
  }
}
```

### **Multiple Conversations Format**

```json
{
  "conversations": [
    {
      "id": "conv-1",
      "platform": "whatsapp",
      "customer": {
        "id": "+1234567890",
        "name": "أحمد محمد"
      },
      "startTime": "2024-01-15T10:30:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "messages": [
        {
          "id": "msg-1",
          "timestamp": "2024-01-15T10:30:00Z",
          "sender": "customer",
          "content": "مرحبا، أريد الاستفسار عن الخدمة",
          "type": "text"
        },
        {
          "id": "msg-2",
          "timestamp": "2024-01-15T10:31:00Z", 
          "sender": "agent",
          "content": "أهلاً بك، كيف يمكنني مساعدتك؟",
          "type": "text"
        }
      ]
    },
    {
      "id": "conv-2",
      "platform": "messenger",
      "customer": {
        "id": "fb-user-123",
        "name": "فاطمة أحمد"
      },
      "startTime": "2024-01-15T14:00:00Z",
      "endTime": "2024-01-15T14:30:00Z",
      "messages": [
        {
          "id": "msg-3",
          "timestamp": "2024-01-15T14:00:00Z",
          "sender": "customer",
          "content": "لدي مشكلة في التطبيق",
          "type": "text"
        },
        {
          "id": "msg-4",
          "timestamp": "2024-01-15T14:05:00Z",
          "sender": "agent", 
          "content": "نعتذر عن الإزعاج، سنحل المشكلة فوراً",
          "type": "text"
        }
      ]
    }
  ]
}
```

### **WhatsApp Export Format**

```json
{
  "export_info": {
    "platform": "whatsapp",
    "export_date": "2024-01-15T12:00:00Z",
    "phone_number": "+1234567890"
  },
  "conversations": [
    {
      "chat_name": "أحمد محمد",
      "participants": [
        {
          "name": "أحمد محمد", 
          "phone": "+1234567890",
          "role": "customer"
        },
        {
          "name": "خدمة العملاء",
          "phone": "+0987654321", 
          "role": "agent"
        }
      ],
      "messages": [
        {
          "timestamp": "15/01/2024, 10:30 - ",
          "sender_name": "أحمد محمد",
          "message": "السلام عليكم",
          "message_type": "text"
        },
        {
          "timestamp": "15/01/2024, 10:31 - ",
          "sender_name": "خدمة العملاء", 
          "message": "وعليكم السلام، كيف يمكنني مساعدتك؟",
          "message_type": "text"
        }
      ]
    }
  ]
}
```

## 🔧 Field Definitions

### **Required Fields**

| Field | Type | Description |
|-------|------|-------------|
| `conversations` or `conversation` | Array/Object | Main conversation data |
| `messages` | Array | Array of messages in the conversation |
| `content` or `message` | String | The actual message text |
| `sender` | String | Who sent the message: "customer" or "agent" |
| `timestamp` | String | ISO 8601 timestamp or parseable date |

### **Optional Fields**

| Field | Type | Description |
|-------|------|-------------|
| `platform` | String | "whatsapp", "messenger", "chat" |
| `customer.name` | String | Customer's display name |
| `customer.phone` | String | Customer's phone number |
| `agent.name` | String | Agent's name |
| `type` | String | Message type: "text", "image", "audio", "document" |
| `language` | String | Message language: "ar", "en" |
| `tags` | Array | Conversation tags for categorization |
| `status` | String | "active", "resolved", "archived" |

## 📱 Platform-Specific Formats

### **WhatsApp Business API Webhook Format**

```json
{
  "conversations": [
    {
      "id": "whatsapp-conv-1",
      "platform": "whatsapp",
      "phone_number_id": "123456789",
      "customer": {
        "wa_id": "+1234567890",
        "profile": {
          "name": "Ahmed Mohamed"
        }
      },
      "messages": [
        {
          "id": "wamid.abc123",
          "from": "+1234567890",
          "timestamp": "1704104400",
          "type": "text",
          "text": {
            "body": "مرحبا، أحتاج مساعدة"
          }
        }
      ]
    }
  ]
}
```

### **Facebook Messenger Format**

```json
{
  "conversations": [
    {
      "id": "messenger-conv-1", 
      "platform": "messenger",
      "page_id": "page-123",
      "customer": {
        "id": "user-456",
        "name": "Fatima Ali"
      },
      "messages": [
        {
          "mid": "m_abc123",
          "sender": {
            "id": "user-456"
          },
          "timestamp": 1704104400000,
          "message": {
            "text": "لدي استفسار عن المنتج"
          }
        }
      ]
    }
  ]
}
```

## ✅ Validation Rules

1. **Required Structure**: Must have either `conversation` or `conversations` root key
2. **Message Array**: Each conversation must have a `messages` array
3. **Message Content**: Each message must have content (text/body/message field)
4. **Sender Identification**: Each message must identify sender (customer/agent/role)
5. **Timestamps**: Timestamps should be parseable (ISO 8601, Unix timestamp, or standard formats)
6. **File Size**: Maximum 10 MB per file
7. **Character Encoding**: UTF-8 encoding required for Arabic text

## 🌟 Best Practices

### **For Optimal Sentiment Analysis**

```json
{
  "conversation": {
    "language": "ar",
    "domain": "customer-support",
    "messages": [
      {
        "content": "الخدمة ممتازة جداً، أنا راضي تماماً",
        "sender": "customer",
        "context": "feedback",
        "intent": "positive-feedback"
      }
    ]
  }
}
```

### **Including Metadata**

```json
{
  "metadata": {
    "source": "whatsapp-business",
    "export_version": "1.0",
    "business_account": "company-name"
  },
  "conversations": [...]
}
```

## 🚀 Quick Start Examples

### **Simple Customer Support Chat**

```json
{
  "conversation": {
    "messages": [
      {
        "sender": "customer",
        "content": "مرحبا، لدي مشكلة في التطبيق",
        "timestamp": "2024-01-15T10:00:00Z"
      },
      {
        "sender": "agent", 
        "content": "أهلاً بك، ما هي المشكلة تحديداً؟",
        "timestamp": "2024-01-15T10:01:00Z"
      },
      {
        "sender": "customer",
        "content": "تم حل المشكلة، شكراً لك",
        "timestamp": "2024-01-15T10:05:00Z"
      }
    ]
  }
}
```

### **Multi-Platform Export**

```json
{
  "export_info": {
    "date": "2024-01-15",
    "platforms": ["whatsapp", "messenger"],
    "total_conversations": 2
  },
  "conversations": [
    {
      "platform": "whatsapp",
      "customer": {"name": "أحمد"},
      "messages": [{"sender": "customer", "content": "مرحبا"}]
    },
    {
      "platform": "messenger", 
      "customer": {"name": "فاطمة"},
      "messages": [{"sender": "customer", "content": "السلام عليكم"}]
    }
  ]
}
```

Upload your JSON file following any of these formats, and TIBYAN will automatically process and analyze the sentiment of all conversations! 🎯
