# Career-Bazaar - AI-Powered Job Portal

An advanced job platform revolutionizing professional development through intelligent, personalized career management tools.

![Career-Bazaar](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🚀 Features

### For Job Seekers
- **Smart Profile Management** - Comprehensive profile editing with skills, experience, and career objectives
- **Intelligent Job Search** - AI-powered job matching with personalized recommendations
- **Resume Management** - Upload, store, and manage resume files with secure cloud storage
- **Application Tracking** - Track job applications with status updates and interview scheduling
- **Reward Points System** - Earn points for profile completion, job applications, blog writing, and referrals
- **Career Blog** - Write and read career-related articles with engagement tracking
- **Messaging System** - Direct communication with employers and HR teams
- **Job Alerts** - Customizable alerts for new job opportunities matching your criteria

### For Employers
- **Company Profiles** - Comprehensive company information with ratings and reviews
- **Job Posting** - Advanced job posting with requirements, benefits, and screening questions
- **Candidate Search** - Search and filter candidates based on skills, experience, and location
- **Application Management** - Review applications with status tracking and communication tools
- **Dashboard Analytics** - Track job posting performance and candidate engagement

### Technical Highlights
- **AI-Powered Matching** - Intelligent job recommendations based on user profiles and preferences
- **Social Authentication** - Google and LinkedIn OAuth integration for seamless login
- **Real-time Messaging** - WebSocket-based messaging system for instant communication
- **Responsive Design** - Modern UI with purple-green gradient theme and glassmorphism effects
- **Database Optimization** - PostgreSQL with efficient queries and connection pooling
- **Security** - Session-based authentication with CSRF protection and data validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Radix UI** primitives for accessibility

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **Neon Database** serverless connection
- **Passport.js** for authentication
- **Multer** for file uploads

### Development
- **Vite** for frontend build and development
- **TypeScript** for type safety across the stack
- **ESBuild** for backend bundling
- **Drizzle Kit** for database migrations

## 🏗️ Architecture

The application follows a modern full-stack architecture:

```
Career-Bazaar/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── auth/              # Authentication strategies
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # Database operations
│   └── job-matching-service.ts  # AI matching logic
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and validation
└── uploads/               # File storage directory
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd career-bazaar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Configure your database URL, session secret, and OAuth credentials
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📱 User Roles

### Candidates
- Register and complete comprehensive profiles
- Search and apply for jobs with intelligent matching
- Track applications and communicate with employers
- Earn reward points for platform engagement
- Write and read career-related blog posts

### Employers
- Create company profiles with detailed information
- Post jobs with advanced filtering options
- Search and contact qualified candidates
- Manage applications and interview scheduling
- Access analytics and performance metrics

## 🔒 Security Features

- **Authentication** - Multi-provider OAuth with session management
- **Data Validation** - Zod schemas for request/response validation
- **File Upload Security** - Type validation and size limits
- **SQL Injection Prevention** - Parameterized queries with Drizzle ORM
- **CSRF Protection** - Session-based CSRF tokens
- **Rate Limiting** - API endpoint protection

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users** - User profiles and authentication
- **companies** - Company information and profiles
- **jobs** - Job postings with requirements and benefits
- **applications** - Job application tracking
- **reward_points** - User engagement and point system
- **blog_posts** - Career-related articles and content
- **messages** - Communication between users

## 🎨 Design System

- **Color Scheme** - Purple-green gradient theme with glassmorphism effects
- **Typography** - Inter font family for modern readability
- **Components** - Consistent design system with Radix UI primitives
- **Responsive** - Mobile-first design approach
- **Accessibility** - WCAG 2.1 compliant components

## 🧪 Testing

Comprehensive testing documentation is available in:
- `TESTING_GUIDE.md` - Page-by-page testing instructions
- `SITE_MAP.md` - Complete navigation structure and user flows

## 📈 Performance

- **Frontend** - Code splitting with lazy loading
- **Backend** - Connection pooling and query optimization
- **Database** - Indexed queries and efficient relationships
- **Caching** - TanStack Query for client-side caching
- **Images** - Optimized asset delivery

## 🚀 Deployment

The application is production-ready with:
- Environment-based configuration
- Database migrations
- Static asset serving
- Session storage in PostgreSQL
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: support@career-bazaar.com
- Documentation: [Project Documentation](./TESTING_GUIDE.md)
- Issues: [GitHub Issues](../../issues)

---

**Career-Bazaar** - Find your career, not just a job! 🚀