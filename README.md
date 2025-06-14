# تِبيان - TIBYAN | Arabic Sentiment Analysis Platform v2.0

![TIBYAN](https://github.com/user-attachments/assets/8699191b-4bb9-4569-a577-9db007b1ec37)

> **Latest Release**: v2.0 - Complete overhaul with modern design, real data integration, and enhanced user experience

<div dir="rtl">



## نظرة عامة

تِبيان هو تطبيق ويب ذكي لتحليل مشاعر العملاء بناءً على محادثاتهم مع فريق الدعم باستخدام الذكاء الاصطناعي. يهدف إلى تزويد الشركات، وخاصة البنوك، بأدوات بصرية دقيقة تساعدهم على فهم مزاج عملائهم وتحسين تجربتهم من خلال تحليل سريع وفعال.


https://github.com/user-attachments/assets/8625459b-378b-48c1-a217-e32a21cd8f01


### الميزات الرئيسية
- 🔐 نظام مصادقة متعدد الأدوار
- 📱 دعم منصات متعددة (واتساب، فيسبوك)
- 🤖 تحليل فوري للمشاعر باللغة العربية
- 📊 لوحة تحكم تحليلية متقدمة
- 🌐 دعم ثنائي اللغة (عربي/إنجليزي)
- 💬 تحليل المحادثات سطر بسطر
- 📄 تصدير التقارير بصيغة PDF

</div>

## Overview

TIBYAN is an intelligent web application for analyzing customer sentiment based on conversations with support teams using AI. The platform provides accurate visual tools to help companies, especially banks, understand their customers' moods and improve their experience through fast and effective analysis.

### 🚀 Live Demo
Visit our [landing page](http://localhost:3000/landing) to explore TIBYAN's features or try the [interactive demo](http://localhost:3000/demo).

## 🌟 Key Features

- **🔐 Multi-Role Authentication**: Customer Service, Quality Supervisors, Data Analysts, PR Managers, Admin
- **📱 Multi-Platform Integration**: WhatsApp Business API, Facebook Messenger API
- **🤖 Real-time Sentiment Analysis**: Arabic text processing with AraBERT integration  
- **📊 Advanced Analytics Dashboard**: Interactive charts, sentiment distribution, trend analysis
- **🌐 Bilingual Support**: Arabic (RTL) and English interfaces with elegant typography
- **💬 Conversation Analysis**: Line-by-line sentiment highlighting with color coding
- **📄 Export Functionality**: PDF report generation and data export
- **🔄 Real-time Updates**: Live notifications and conversation updates
- **🎨 Modern UI/UX**: Beautiful Arabic-first design with decorative Amiri font
- **📱 Responsive Design**: Optimized for desktop and tablet devices
- **🔍 Advanced Filtering**: Priority system for negative conversations
- **✅ Conversation Management**: Mark conversations as "dealt with" with persistence

## 🏗️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router and TypeScript
- **Tailwind CSS**: Modern utility-first CSS framework
- **React Hook Form**: Efficient form handling with validation
- **Recharts**: Interactive data visualization library
- **NextAuth.js**: Complete authentication solution
- **Amiri Font**: Beautiful Arabic typography

### Backend
- **Node.js/Express**: API server integration
- **FastAPI**: Sentiment analysis service (Python)
- **MongoDB**: Document database for data storage
- **Mongoose**: ODM for MongoDB
- **Socket.io**: Real-time communication
- **bcryptjs**: Password hashing

### Development Tools
- **TypeScript**: Type safety and better development experience
- **ESLint**: Code linting and formatting
- **Zod**: Runtime type validation
- **VS Code**: Recommended development environment

## 📱 Application Pages

### Public Pages
1. **🏠 Landing Page** - Modern Arabic-first welcome page with feature showcase
2. **🔐 Sign In/Sign Up** - Authentication pages with role-based access

### Dashboard Pages  
3. **📊 Main Dashboard** - Overview with analytics charts and recent analyses
4. **📁 Upload Page** - File upload interface for CSV/text files with drag-and-drop
5. **📈 Analytics** - Detailed personal analytics with time-range filtering
6. **💬 Conversation Analyzer** - Real-time conversation analysis with sentiment highlighting
7. **👥 Admin Panel** - System-wide analytics and user management (admin only)
8. **⚙️ Settings/Profile** - User preferences, language settings, and profile management

### Special Pages
9. **🎭 Demo Page** - Interactive demonstration of sentiment analysis
10. **🔄 Status Pages** - Loading states, 404 errors, and empty states

## 🚀 Quick Start

### 🆕 Latest Updates (v2.0)

- **🎨 New Color Palette**: Modern blue/gray scheme with sophisticated gradients
- **📱 Enhanced Landing Page**: Arabic-first design with interactive demonstrations
- **🎭 Interactive Demo**: Try sentiment analysis without registration
- **🔤 Decorative Typography**: Beautiful Amiri font throughout the application  
- **⚡ Real Data Integration**: All analytics powered by live MongoDB data
- **🎯 Priority System**: Automatic highlighting of negative conversations
- **✅ Conversation Management**: Mark conversations as "dealt with" with full persistence
- **🔄 Improved Navigation**: Seamless flow between analytics and conversation details
- **📊 Enhanced Dashboard**: Modern card layouts with beautiful data visualizations

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- FastAPI sentiment analysis service

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tibyan.git
cd tibyan/website

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-secret-key-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tibyan

# FastAPI Sentiment Analysis Service
FASTAPI_URL=http://localhost:8000

# Optional: External API Keys
WHATSAPP_TOKEN=your-whatsapp-access-token
MESSENGER_ACCESS_TOKEN=your-messenger-access-token
```

### Running the Application

```bash
# Start MongoDB (if using local installation)
mongod

# Start the FastAPI sentiment service (in separate terminal)
# cd /path/to/fastapi-service
# python main.py

# Start the Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## 📁 Sample Data & Testing

TIBYAN includes comprehensive sample data to help you get started:

### Sample Conversation Files
Located in `/sample_files/`, these demonstrate different conversation types:

- **`positive_conversation.json`** - Customer satisfaction examples
- **`mixed_conversations.json`** - Varied sentiment throughout conversation  
- **`urgent_negative_conversation.json`** - High-priority negative feedback
- **`test_sentiment_conversation.json`** - Comprehensive test data

### Demo Mode
When MongoDB is unavailable, TIBYAN automatically switches to demo mode with:
- Pre-loaded sample conversations
- Mock analytics data  
- Full UI functionality for testing
- LocalStorage persistence for "dealt with" status

### Testing the Application
1. **Upload Sample Files**: Use the provided JSON files to test upload functionality
2. **Try the Demo Page**: Visit `/demo` for interactive sentiment analysis
3. **Explore Analytics**: View comprehensive reports with real-time data
4. **Test User Roles**: Log in with different demo accounts to see role-based features

## 👥 User Roles & Demo Accounts

TIBYAN supports multiple user roles with different access levels:

| Role | Permissions | Demo Email | Password |
|------|-------------|------------|----------|
| **Administrator** | Full system access, user management | `admin@tibyan.com` | `password123` |
| **Customer Service** | Basic conversation analysis | `service@tibyan.com` | `password123` |
| **Quality Supervisor** | Advanced analytics, team oversight | `supervisor@tibyan.com` | `password123` |
| **Data Analyst** | Deep analytics, custom reports | `analyst@tibyan.com` | `password123` |
| **PR Manager** | Public sentiment monitoring | `pr@tibyan.com` | `password123` |

### Authentication Features

- ✅ Secure JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ Session management
- ✅ Protected routes and API endpoints

## 🎯 Key Features Deep Dive

### Sentiment Analysis
- **Arabic Language Support**: Optimized for Arabic text processing
- **Real-time Analysis**: Instant sentiment detection as conversations flow
- **Confidence Scoring**: Each analysis includes confidence percentages
- **Batch Processing**: Upload and analyze multiple conversations
- **Historical Tracking**: Track sentiment trends over time

### Analytics Dashboard
- **Interactive Charts**: Beautiful data visualizations with Recharts
- **Time Range Filtering**: Analyze data across different periods
- **Sentiment Distribution**: Pie charts showing positive/negative/neutral ratios
- **Trend Analysis**: Line graphs showing sentiment evolution
- **Export Capabilities**: Download reports as PDF or CSV

### Conversation Management
- **Color-coded Messages**: Visual sentiment indicators
- **Priority System**: Negative conversations highlighted for urgent attention
- **Mark as Dealt With**: Track conversation resolution status
- **Advanced Filtering**: Filter by sentiment, date, status, user
- **Real-time Updates**: Live conversation monitoring

### File Upload & Processing
- **Multiple Formats**: Support for CSV, TXT, and JSON files
- **Drag & Drop**: Intuitive file upload interface
- **Batch Analysis**: Process hundreds of conversations at once
- **Progress Tracking**: Real-time upload and analysis progress
- **Error Handling**: Comprehensive validation and error reporting
## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── auth/              # Authentication pages (signin, signup)
│   ├── dashboard/         # Main dashboard with analytics overview
│   ├── upload/            # File upload functionality with drag-and-drop
│   ├── analytics/         # Detailed analytics and reports with real data
│   ├── analyzer/          # Conversation analysis with sentiment highlighting
│   ├── admin/             # Admin panel for user management
│   ├── settings/          # User settings and preferences
│   ├── landing/           # Modern Arabic-first landing page
│   ├── demo/              # Interactive sentiment analysis demo
│   ├── globals.css        # Global styles with Amiri font and custom palette
│   └── api/               # API routes for all backend functionality
│       ├── auth/          # NextAuth.js authentication endpoints
│       ├── analytics/     # Analytics data endpoints
│       ├── conversations/ # Conversation management endpoints
│       ├── upload/        # File upload and processing
│       ├── files/         # File listing and management
│       └── webhooks/      # External platform webhooks
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (Button, Card, Logo)
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── pages/            # Page-specific components (LandingPage)
├── lib/                  # Utilities and configurations
│   ├── models/           # MongoDB Mongoose models (User, Conversation, FileUpload)
│   ├── services/         # External service integrations (sentiment analysis)
│   ├── auth-config.ts    # NextAuth configuration with role-based access
│   ├── mongodb.ts        # Database connection with fallback support
│   └── utils.ts          # Helper functions and utilities
├── types/                # TypeScript type definitions
│   └── index.ts          # All application types and interfaces
└── public/               # Static assets
    ├── tibyan-logo.png   # Application logo
    └── sample_files/     # Sample conversation files for testing
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run seed         # Seed database with demo data
npm run migrate      # Run database migrations
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

#### Analytics & Data
- `GET /api/analytics` - User analytics data
- `GET /api/conversations` - List conversations
- `GET /api/conversations/analyze` - Analyzed conversations
- `PATCH /api/conversations/[id]/dealt-with` - Mark conversation as dealt with

#### File Management
- `POST /api/upload` - File upload and analysis
- `GET /api/files` - List uploaded files

#### External Integrations
- `POST /api/webhooks/whatsapp` - WhatsApp webhook
- `POST /api/webhooks/messenger` - Messenger webhook

### Database Schema

#### User Model
```typescript
interface User {
  _id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  department?: string;
  isActive: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Conversation Model
```typescript
interface Conversation {
  _id: string;
  userId: string;
  platform: 'whatsapp' | 'messenger' | 'upload';
  messages: ConversationMessage[];
  overallSentiment: 'positive' | 'negative' | 'neutral';
  averageConfidence: number;
  priority: number;
  dealtWith: boolean;
  dealtWithAt?: Date;
  dealtWithBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 UI/UX Design

### Design Principles
- **Arabic-First**: RTL layout optimized for Arabic content
- **Modern & Clean**: Minimalist design with elegant typography
- **Accessible**: WCAG compliant with proper ARIA labels
- **Responsive**: Mobile-first responsive design
- **Color Psychology**: Meaningful color coding for sentiment analysis

### Typography
- **Primary Font**: Amiri - Elegant Arabic serif font
- **Secondary Font**: Inter - Modern sans-serif for UI elements
- **Decorative Elements**: Custom Arabic calligraphy touches

### Color Scheme
- **Primary Palette**: Custom blue/gray gradient scheme (Blue: #1E40AF, #3B82F6; Gray: #374151, #6B7280)
- **Sentiment Colors**: Green (#10B981 - positive), Red (#EF4444 - negative), Amber (#F59E0B - neutral)
- **UI Colors**: Sophisticated blue-gray tones for modern appearance
- **Status Colors**: Clear indicators for success, warning, error states
- **Accent Colors**: Elegant gradients for call-to-action elements

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API endpoint and database integration tests
- **E2E Tests**: Full user workflow testing with Playwright
- **Accessibility Tests**: Screen reader and keyboard navigation tests

## 🚀 Deployment

### Environment Variables for Production

```env
# Production Configuration
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-32-chars-min

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tibyan

# External Services
FASTAPI_URL=https://your-sentiment-api.com

# Optional Integrations
WHATSAPP_TOKEN=your-production-whatsapp-token
MESSENGER_ACCESS_TOKEN=your-production-messenger-token
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

## 🔒 Security Features

- **Authentication**: Secure JWT tokens with NextAuth.js
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas for all inputs
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: API rate limiting for abuse prevention
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: React's built-in XSS prevention

## 🌍 Internationalization

### Supported Languages
- **Arabic (AR)**: Primary language with RTL support
- **English (EN)**: Secondary language for international users

### Adding New Languages
1. Add translation files to `/public/locales/[lang]/`
2. Update language configurations
3. Test RTL/LTR layout compatibility

## 📈 Performance Optimization

### Built-in Optimizations
- **Next.js 15**: Latest performance improvements
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting and lazy loading
- **Static Generation**: ISR for better performance
- **Caching**: Intelligent caching strategies

### Monitoring
- **Analytics**: Built-in usage analytics
- **Error Tracking**: Error boundary implementation
- **Performance Metrics**: Core Web Vitals monitoring

## 🤝 Contributing

We welcome contributions to TIBYAN! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add JSDoc comments for functions
- Ensure responsive design works on all devices
- Test Arabic RTL layout compatibility
- Maintain accessibility standards

### Code Style
- Use ESLint and Prettier configurations
- Follow existing naming conventions
- Write meaningful component and variable names
- Add proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### Getting Help
- **📧 Email**: mohammedoqady@gmail.com
- **📖 Documentation**: [Project Wiki]()
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-username/tibyan/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/tibyan/discussions)

### Frequently Asked Questions

**Q: Can I use TIBYAN without the FastAPI service?**
A: TIBYAN requires the sentiment analysis service to function. However, you can run it in demo mode for UI testing.

**Q: How do I add new languages?**
A: Add translation files to `/public/locales/[language]/` and update the language configuration.

**Q: Can I customize the sentiment analysis models?**
A: Yes, you can replace the FastAPI service with your own sentiment analysis implementation.

**Q: Is TIBYAN suitable for other languages besides Arabic?**
A: While optimized for Arabic, TIBYAN can be adapted for other languages by updating the sentiment analysis service and UI text.

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues**
- Ensure MongoDB is running on the correct port (27017)
- Check your `MONGODB_URI` in `.env.local`
- TIBYAN will automatically switch to demo mode if database is unavailable

**Authentication Problems**
- Verify `NEXTAUTH_SECRET` is set in environment variables
- Clear browser cookies and localStorage
- Ensure the NextAuth URL matches your development URL

**File Upload Errors**
- Check file format (JSON, CSV, TXT supported)
- Ensure FastAPI sentiment service is running
- Verify file size is under upload limits

**Sentiment Analysis Not Working**
- Confirm FastAPI service is running on port 8000
- Check `FASTAPI_URL` environment variable
- Review network connectivity between services

**Styling Issues**
- Clear browser cache and restart development server
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS rules

### Getting Help

If you encounter issues not covered here:
1. Check the [GitHub Issues](https://github.com/your-username/tibyan/issues)
2. Review the API integration documentation


## 🏆 Acknowledgments

- **AraBERT**: For Arabic language sentiment analysis
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **MongoDB**: For the flexible document database
- **Vercel**: For deployment and hosting solutions

## 📊 Project Status

### ✅ Completed Features
- **Authentication System**: Complete with JWT and role-based access control
- **Landing Page**: Modern Arabic-first design with interactive elements
- **Dashboard**: Analytics overview with real-time data and beautiful charts
- **File Upload**: Drag-and-drop interface with progress tracking and validation
- **Conversation Analysis**: Real-time sentiment analysis with color-coded highlighting
- **Analytics Page**: Comprehensive reports with time-range filtering and live data
- **Admin Panel**: User management and system-wide analytics
- **Responsive Design**: Mobile and tablet optimized layouts
- **Conversation Management**: Mark as "dealt with" with MongoDB persistence
- **Demo Mode**: Full functionality fallback when database unavailable
- **Color Palette**: Custom blue/gray theme throughout application
- **Typography**: Decorative Amiri font integration for Arabic aesthetics
- **Sample Data**: Comprehensive test files and demo conversations
- **Documentation**: Complete setup and API documentation

### 🔄 In Progress
- **WhatsApp Integration**: Business API webhook implementation
- **Facebook Messenger**: Messenger API integration
- **Export Features**: PDF report generation
- **Advanced Filtering**: Enhanced search and filter capabilities

### 📋 Planned Features
- **Mobile App**: React Native companion app
- **Real-time Notifications**: Socket.io live updates
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Additional language support beyond Arabic/English
- **API Documentation**: Interactive API documentation with Swagger

---

<div dir="rtl">

## 🇸🇦 المساهمة في المشروع

نرحب بمساهماتكم في تطوير تِبيان! يمكنكم المساعدة من خلال:

- 🐛 الإبلاغ عن الأخطاء
- 💡 اقتراح ميزات جديدة  
- 📝 تحسين الوثائق
- 🌐 إضافة ترجمات جديدة
- 🧪 كتابة اختبارات إضافية

### التواصل باللغة العربية
- البريد الإلكتروني: mohammedoqady@gmail.com
- الوثائق: [ويكي المشروع]()
- المناقشات: [GitHub Discussions](https://github.com/your-username/tibyan/discussions)

## 🙏 شكر خاص


</div>

---

**Made with ❤️ for the Arabic-speaking community**
