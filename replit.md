# Career-Bazaar - Job Portal Application

## Overview

Career-Bazaar is a full-stack job portal application built with React, Node.js/Express, and PostgreSQL. The application provides a platform for job seekers to search and apply for jobs, and for companies to post job listings. It features user authentication, job search functionality, company profiles, and application management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with localStorage for user session
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Build Tool**: Vite for frontend, esbuild for backend
- **Session Management**: PostgreSQL database with persistent data storage

## Key Components

### Authentication System
- User registration and login with email/password
- Session management using localStorage
- Protected routes with AuthGuard component
- User profile management with skills, experience, and salary information

### Job Management
- Job listings with search and filtering capabilities
- Job categories and company-based filtering
- Application tracking system
- Job posting for companies

### Company System
- Company profiles with ratings and reviews
- Featured companies section
- Company-specific job listings

### Database Schema
- **Users**: Authentication, profile information, skills, experience
- **Companies**: Company details, ratings, industry information
- **Jobs**: Job postings with requirements, benefits, and application tracking
- **Applications**: Job application tracking with status management
- **Job Categories**: Classification system for job types

## Data Flow

1. **User Authentication**: Frontend sends credentials to `/api/auth/login` or `/api/auth/register`
2. **Job Search**: Frontend queries `/api/jobs` with search parameters and filters
3. **Company Data**: Company information fetched from `/api/companies` endpoints
4. **Applications**: Users can apply through `/api/applications` endpoints
5. **Profile Management**: User profile updates via `/api/users/:id` endpoints

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- UI Framework (Radix UI, Tailwind CSS, shadcn/ui)
- Data fetching (TanStack Query)
- Form handling (React Hook Form, Zod validation)
- Date utilities (date-fns)
- Icons (Lucide React)

### Backend Dependencies
- Express.js for API server
- Drizzle ORM for database operations
- Neon Database serverless driver
- Zod for schema validation
- PostgreSQL session storage (connect-pg-simple)

### Development Dependencies
- Vite for frontend build and development
- TypeScript for type safety
- ESBuild for backend bundling
- Tailwind CSS for styling
- PostCSS for CSS processing

## Deployment Strategy

### Development Environment
- Frontend: Vite dev server with HMR
- Backend: tsx for TypeScript execution
- Database: Neon Database with connection pooling
- Asset serving: Vite middleware for static files

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: ESBuild bundle to `dist/index.js`
- Database migrations: Drizzle Kit for schema management
- Static file serving: Express static middleware

### Database Management
- **Database**: PostgreSQL with Neon Database serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in `shared/schema.ts` with full type safety
- **Connection**: Serverless connection pooling via environment variables
- **Migration**: Use `npm run db:push` to sync schema changes
- **Seeding**: Sample data populated via `server/seed.ts`

### Recent Changes (July 23, 2025)
- ✅ Successfully migrated from in-memory storage to PostgreSQL database
- ✅ Implemented DatabaseStorage class with full CRUD operations
- ✅ Created database schema with users, companies, jobs, applications, and job categories
- ✅ Seeded database with sample Indian companies and job listings
- ✅ All API endpoints now use persistent PostgreSQL storage
- ✅ Fixed application branding from "Naukri.com" to "Career-Bazaar"
- ✅ Complete UI redesign with modern purple-green gradient theme
- ✅ Redesigned header with new logo and navigation using Inter font
- ✅ Created bold hero section with "Find your career, not just a job" tagline
- ✅ Enhanced search functionality with location and experience filters
- ✅ Added modern card designs with hover effects and microinteractions
- ✅ Implemented new color system with CSS custom properties
- ✅ Fixed critical API endpoint: `/api/companies/industries` now working correctly
- ✅ Enhanced company search with filtering by search, industry, and type
- ✅ Replaced broken Link components with proper navigation using `useLocation` hook
- ✅ Added Terms & Conditions and Privacy Policy pages with comprehensive content
- ✅ Created complete Employer section with Post Job, Login, Dashboard, Search Resume, and Pricing pages
- ✅ Fixed all navigation links throughout the application for proper routing
- ✅ Built complete 52+ page job portal covering all candidate and employer features
- ✅ Removed test accounts and configured production-ready database implementation
- ✅ **Added social media authentication (Google & LinkedIn OAuth) using Passport.js**
- ✅ **Created social login buttons component for login and registration pages**
- ✅ **Implemented session-based authentication with PostgreSQL session storage**
- ✅ **Prepared Git repository for deployment with comprehensive documentation**
- ✅ **Created Digital Ocean droplet deployment guide with full server setup**
- ✅ **Added comprehensive candidate dropdown menu under user icon in header with 8 menu items**
- ✅ **Created complete tab functionality for each candidate menu item with full interactive features**
- ✅ **Implemented URL hash navigation for direct linking to specific dashboard sections**
- ✅ **Enhanced Saved Jobs tab with search, filter, and job management capabilities**
- ✅ **Built advanced Job Alerts system with create, edit, pause/activate functionality**
- ✅ **Developed interactive Messages tab with split-screen conversation interface**
- ✅ **Created comprehensive Meetings & Interviews tab with scheduling and status management**
- ✅ **All candidate menu items now properly navigate to respective profile tab sections**
- ✅ Application ready for production deployment with complete candidate dashboard functionality

The application uses a monorepo structure with shared types and schemas, enabling type safety across the full stack while maintaining clear separation between frontend and backend concerns.