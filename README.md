# Career-Bazaar - Job Portal Application

A comprehensive job portal web application built with React, Node.js, and PostgreSQL. Career-Bazaar provides a complete platform for job seekers to find opportunities and for employers to post jobs and manage applications.

## Features

### For Job Seekers
- Browse and search jobs with advanced filters
- Apply for positions with cover letters
- Save jobs for later viewing
- Track application status
- Set up personalized job alerts
- Complete profile management with skills and experience
- Social media login (Google & LinkedIn)

### For Employers
- Post and manage job listings
- View and manage applications
- Search and contact candidates
- Messaging system with applicants
- Company profile management
- Analytics and reporting

### Platform Features
- Company directory with detailed profiles
- Blog system for career advice
- Responsive design for all devices
- Real-time notifications
- Advanced search and filtering
- Professional UI with glassmorphism effects

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Radix UI** primitives

### Backend
- **Node.js** with Express.js
- **TypeScript** throughout the stack
- **PostgreSQL** with Drizzle ORM
- **Passport.js** for authentication
- **Social OAuth** (Google & LinkedIn)
- **Session-based** authentication

### Database
- **PostgreSQL** with Neon Database
- **Drizzle ORM** for type-safe operations
- **Database migrations** with Drizzle Kit

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd career-bazaar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database_name
SESSION_SECRET=your_random_session_secret

# Optional - for social login
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

4. Set up the database:
```bash
npm run db:push
npx tsx server/seed.ts
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5000` to see the application.

## Deployment

### Digital Ocean Droplet Deployment

1. **Server Setup** (Ubuntu 20.04+):
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

2. **Database Setup**:
```bash
sudo -u postgres psql
CREATE DATABASE career_bazaar;
CREATE USER career_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE career_bazaar TO career_user;
\q
```

3. **Deploy Application**:
```bash
# Clone repository
git clone [your-repo-url] /var/www/career-bazaar
cd /var/www/career-bazaar

# Install dependencies
npm install

# Build application
npm run build

# Set up environment variables
cp .env.example .env
# Edit .env with your production values

# Set up database
npm run db:push
npx tsx server/seed.ts

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Nginx Configuration** (optional):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate database migrations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/linkedin` - LinkedIn OAuth login

### Jobs
- `GET /api/jobs` - Get jobs with filters
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employers)
- `PUT /api/jobs/:id` - Update job (employers)

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Apply for job
- `PUT /api/applications/:id` - Update application status

### Companies
- `GET /api/companies` - Get companies
- `GET /api/companies/:id` - Get company details
- `GET /api/companies/featured` - Get featured companies

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `companies` - Company information and profiles
- `jobs` - Job postings and details
- `applications` - Job applications and status
- `job_categories` - Job categorization system

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React, Node.js, and PostgreSQL