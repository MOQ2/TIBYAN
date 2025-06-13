# تِبيان - TIBYAN | Arabic Sentiment Analysis Platform

<div dir="rtl">

## نظرة عامة

تِبيان هو تطبيق ويب ذكي لتحليل مشاعر العملاء بناءً على محادثاتهم مع فريق الدعم باستخدام الذكاء الاصطناعي. يهدف إلى تزويد الشركات، وخاصة البنوك، بأدوات بصرية دقيقة تساعدهم على فهم مزاج عملائهم وتحسين تجربتهم.

</div>

## Overview

TIBYAN is an intelligent web application for analyzing customer sentiment based on conversations with support teams using AI. The platform provides accurate visual tools to help companies, especially banks, understand their customers' moods and improve their experience through fast and effective analysis.

## Features

- **🔐 Multi-Role Authentication**: Customer Service, Quality Supervisors, Data Analysts, PR Managers, Admin
- **📱 Multi-Platform Integration**: WhatsApp Business API, Facebook Messenger API
- **🤖 Real-time Sentiment Analysis**: Arabic text processing with AraBERT integration
- **📊 Analytics Dashboard**: Visual reports, pie charts, line graphs
- **🌐 Bilingual Support**: Arabic (RTL) and English interfaces
- **💬 Conversation Analysis**: Line-by-line sentiment highlighting
- **📄 Export Functionality**: PDF report generation
- **🔄 Real-time Updates**: Socket.io for live chat updates

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, React Hook Form
- **Backend**: Node.js/Express API with integration to FastAPI sentiment analysis service
- **Database**: MongoDB for user management, conversation storage, and analytics
- **Authentication**: NextAuth.js with JWT strategy
- **Real-time**: Socket.io for live chat updates
- **Charts**: Recharts for analytics dashboards
- **Internationalization**: next-i18next for Arabic/English bilingual support

## Page Structure (8 Pages)

1. **Login/Signup** - Authentication with role-based access
2. **Main Dashboard** - Overview with charts and recent analyses  
3. **Upload Page** - File upload interface for CSV/text files
4. **User Analytics** - Personal statistics and sentiment distribution
5. **Conversation Analyzer** - Line-by-line chat analysis with color coding
6. **Admin Panel** - All users' results (admin only)
7. **Settings/Profile** - Language, password, profile management
8. **Status Pages** - Loading, 404, empty states

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- FastAPI sentiment analysis service (provided)

## Installation

### 1. Clone and Setup

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd tibyan/website

# Install dependencies
npm install
\`\`\`

### 2. Environment Configuration

Copy the environment variables file and update with your values:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Update \`.env.local\` with your configuration:

\`\`\`env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-secret-key-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tibyan

# FastAPI Sentiment Analysis Service
FASTAPI_URL=http://localhost:8000

# WhatsApp Business API (Optional)
WHATSAPP_TOKEN=your-whatsapp-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token

# Facebook Messenger API (Optional)
MESSENGER_ACCESS_TOKEN=your-messenger-access-token
MESSENGER_VERIFY_TOKEN=your-messenger-verify-token
FACEBOOK_APP_SECRET=your-facebook-app-secret
\`\`\`

### 3. Database Setup

Start MongoDB and create demo users:

\`\`\`bash
# Make sure MongoDB is running
# Then seed the database with demo users
npm run seed
\`\`\`

This will create demo accounts:
- **admin@tibyan.com** - Administrator
- **service@tibyan.com** - Customer Service
- **supervisor@tibyan.com** - Quality Supervisor  
- **analyst@tibyan.com** - Data Analyst
- **pr@tibyan.com** - PR Manager

**Password for all accounts**: \`password123\`

### 4. Start the FastAPI Service

Make sure your FastAPI sentiment analysis service is running on port 8000:

\`\`\`bash
# In the FastAPI project directory
python main.py
\`\`\`

### 5. Run the Application

\`\`\`bash
# Start the development server
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

### Demo Accounts

You can login with any of these demo accounts:

| Email | Role | Password |
|-------|------|----------|
| admin@tibyan.com | Administrator | password123 |
| service@tibyan.com | Customer Service | password123 |
| supervisor@tibyan.com | Quality Supervisor | password123 |
| analyst@tibyan.com | Data Analyst | password123 |
| pr@tibyan.com | PR Manager | password123 |

### Navigation

- **Dashboard**: Overview of sentiment analytics and recent analyses
- **Upload**: Upload CSV/text files for batch sentiment analysis
- **Analytics**: Personal analytics and detailed reports
- **Conversations**: Real-time conversation analysis with sentiment highlighting
- **Settings**: User preferences, language settings, and profile management
- **Admin Panel**: (Admin only) System-wide analytics and user management

### API Integration

The application integrates with your existing FastAPI sentiment analysis service. Make sure the FastAPI service is running and accessible at the URL specified in \`FASTAPI_URL\`.

## Development

### Project Structure

\`\`\`
src/
├── app/                    # Next.js 15 App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── upload/            # File upload functionality
│   ├── analytics/         # Analytics and reports
│   ├── conversations/     # Conversation analysis
│   ├── admin/             # Admin panel
│   ├── settings/          # User settings
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── models/           # MongoDB models
│   ├── auth.ts           # NextAuth configuration
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
\`\`\`

### Building for Production

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### Linting and Code Quality

\`\`\`bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
\`\`\`

## API Endpoints

The application provides several API endpoints:

- \`POST /api/auth/[...nextauth]\` - Authentication endpoints
- \`POST /api/sentiment/analyze\` - Single text sentiment analysis
- \`POST /api/sentiment/batch\` - Batch sentiment analysis
- \`GET /api/analytics/user\` - User analytics data
- \`GET /api/conversations\` - User conversations
- \`POST /api/upload\` - File upload for analysis

## Deployment

### Environment Variables for Production

Ensure all environment variables are properly set for production:

\`\`\`env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
MONGODB_URI=your-production-mongodb-uri
FASTAPI_URL=your-production-fastapi-url
\`\`\`

### Docker Deployment (Optional)

\`\`\`dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@tibyan.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

<div dir="rtl">

## الدعم الفني

للحصول على الدعم الفني والاستفسارات:
- البريد الإلكتروني: support@tibyan.com
- الوثائق: [ويكي المشروع]
- المشاكل التقنية: [GitHub Issues]

</div>
