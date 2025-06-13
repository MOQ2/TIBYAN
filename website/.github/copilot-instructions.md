# TIBYAN - Arabic Sentiment Analysis Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
TIBYAN (تِبيان) is an intelligent web application for analyzing customer sentiment based on conversations with support teams using AI. The platform provides accurate visual tools to help companies, especially banks, understand their customers' moods and improve their experience through fast and effective analysis.

## Technology Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, React Hook Form
- **Backend**: Node.js/Express API with integration to existing FastAPI sentiment analysis service
- **Database**: MongoDB for user management, conversation storage, and analytics
- **Authentication**: NextAuth.js with multiple user roles
- **Integrations**: WhatsApp Business API, Facebook Messenger API
- **Real-time**: Socket.io for live chat updates
- **Charts**: Chart.js/Recharts for analytics dashboards
- **Internationalization**: next-i18next for Arabic/English bilingual support

## Key Features
1. **User Roles**: Customer Service, Quality Supervisors, Data Analysts, Public Relations Managers
2. **Multi-platform Integration**: WhatsApp, Messenger
3. **Real-time Sentiment Analysis**: Arabic text processing with AraBERT
4. **Analytics Dashboard**: Visual reports, pie charts, line graphs
5. **Bilingual Support**: Arabic (RTL) and English interfaces
6. **Conversation Analysis**: Line-by-line sentiment highlighting
7. **Export Functionality**: PDF report generation

## Page Structure (8 Pages)
1. Login/Signup - Authentication with role-based access
2. Main Dashboard - Overview with charts and recent analyses
3. Upload Page - File upload interface for CSV/text files
4. User Analytics - Personal statistics and sentiment distribution
5. Conversation Analyzer - Line-by-line chat analysis with color coding
6. Admin Panel - All users' results (admin only)
7. Settings/Profile - Language, password, profile management
8. Status Pages - Loading, 404, empty states

## Coding Guidelines
- Use TypeScript with strict type checking
- Implement proper error handling and loading states
- Follow React best practices with hooks and functional components
- Use Tailwind CSS for styling with RTL support for Arabic
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Use React Query for API state management
- Implement proper authentication guards for protected routes
- Use proper validation with Zod schemas
- Follow atomic design principles for components
- Implement proper SEO with Next.js metadata

## API Integration
- Integrate with existing FastAPI sentiment analysis service
- Implement RESTful API endpoints for CRUD operations
- Use proper error handling and status codes
- Implement rate limiting and request validation
- Use environment variables for configuration

## UI/UX Guidelines
- Modern, clean design with Arabic aesthetic touches
- Green (#10B981), Red (#EF4444), Yellow (#F59E0B) for sentiment colors
- Responsive design (desktop and tablet priority)
- Smooth animations and transitions
- Proper loading states and error messages
- Dark/light theme support
- RTL layout support for Arabic content

## Security Considerations
- Implement proper authentication and authorization
- Use HTTPS for all communications
- Sanitize user inputs
- Implement CSRF protection
- Use secure session management
- Implement proper logging and monitoring
