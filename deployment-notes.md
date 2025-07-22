# Career-Bazaar Deployment Guide for Hostinger

## Database Configuration

### Prerequisites
1. PostgreSQL database on Hostinger
2. Database connection details (host, port, username, password, database name)

### Environment Variables Required
Set these environment variables in your Hostinger hosting panel:

```
DATABASE_URL=postgresql://username:password@host:port/database_name
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database_name
```

### Database Setup
1. Create the database tables using Drizzle migrations:
```bash
npm run db:push
```

2. Seed the database with sample data:
```bash
npx tsx server/seed.ts
```

## Application Features

### User Authentication
- Users can register as candidates or employers
- Session management using PostgreSQL
- Profile management with skills, experience, and preferences

### Candidate Features
- Browse and search jobs
- Apply for positions
- Save jobs for later
- Track application status
- Set up job alerts
- Manage profile and account settings

### Employer Features
- Post and manage job listings
- View and manage applications
- Search and contact candidates
- Messaging system
- Analytics and reporting

### General Features
- Company directory with detailed profiles
- Blog system for career advice
- Help center and FAQ
- Contact and support pages

## Deployment Steps

1. Upload all files to your Hostinger hosting directory
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db:push`
5. Seed database: `npx tsx server/seed.ts`
6. Start the application: `npm run dev`

## File Structure

- `/client` - React frontend application
- `/server` - Node.js/Express backend
- `/shared` - Shared types and schemas
- `drizzle.config.ts` - Database configuration
- `package.json` - Dependencies and scripts

## Database Schema

### Tables Created:
- `users` - User accounts (candidates and employers)
- `companies` - Company profiles and information
- `jobs` - Job postings and details
- `applications` - Job applications and status
- `job_categories` - Job classification system

### Sample Data Included:
- 6 major Indian companies (TCS, Infosys, ICICI Bank, Wipro, Amazon India, Microsoft India)
- 6 job categories (Software & IT, Banking & Finance, Marketing, Data Science, Engineering, HR)
- 6 sample job postings across different roles and companies

## Production Considerations

1. **Security**: Implement proper password hashing in production
2. **Environment**: Use proper environment variables for database connection
3. **SSL**: Enable SSL for database connections in production
4. **Backup**: Set up regular database backups
5. **Monitoring**: Implement logging and error monitoring
6. **Performance**: Consider connection pooling for high traffic

## Support

The application is fully configured for database operation and does not rely on test accounts or mock data. All user registration and authentication flows through the PostgreSQL database.