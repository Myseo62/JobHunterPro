# Digital Ocean Droplet Deployment Guide

## Step 1: Create GitHub Repository

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `career-bazaar` 
   - Make it public or private as you prefer
   - Don't initialize with README (we already have one)

2. **Connect your local repository to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/career-bazaar.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Digital Ocean Droplet Setup

### Server Preparation (Ubuntu 20.04/22.04)

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### PostgreSQL Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE career_bazaar;
CREATE USER career_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE career_bazaar TO career_user;
ALTER USER career_user CREATEDB;
\q

# Configure PostgreSQL for remote connections (if needed)
sudo nano /etc/postgresql/*/main/postgresql.conf
# Uncomment: listen_addresses = 'localhost'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: local   all   career_user   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql
```

## Step 3: Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/career-bazaar
sudo chown $USER:$USER /var/www/career-bazaar

# Clone your repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/career-bazaar.git
cd career-bazaar

# Install dependencies
npm install

# Build the application
npm run build

# Set up environment variables
cp .env.example .env
nano .env
```

### Configure Environment Variables (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://career_user:your_strong_password@localhost:5432/career_bazaar
PGHOST=localhost
PGPORT=5432
PGUSER=career_user
PGPASSWORD=your_strong_password
PGDATABASE=career_bazaar

# Session Configuration (generate a strong random key)
SESSION_SECRET=your_very_long_random_session_secret_key_here

# Optional - Social Login
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Application Configuration
NODE_ENV=production
PORT=5000
```

### Initialize Database

```bash
# Push database schema
npm run db:push

# Seed with sample data
npx tsx server/seed.ts
```

### Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions shown by the command above

# Check application status
pm2 status
pm2 logs career-bazaar
```

## Step 4: Nginx Configuration (Recommended)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/career-bazaar
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;  # Replace with your domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

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
        
        # Increase proxy timeout for large requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;
}
```

Enable the site:

```bash
# Enable site configuration
sudo ln -s /etc/nginx/sites-available/career-bazaar /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
```

## Step 5: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your_domain.com -d www.your_domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## Step 6: Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Check firewall status
sudo ufw status
```

## Step 7: Monitoring and Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs career-bazaar

# Monitor resources
pm2 monit

# Restart application
pm2 restart career-bazaar

# Stop application
pm2 stop career-bazaar
```

### Application Updates

```bash
cd /var/www/career-bazaar

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build application
npm run build

# Push database changes (if any)
npm run db:push

# Restart application
pm2 restart career-bazaar
```

### Backup Database

```bash
# Create backup
pg_dump -h localhost -U career_user -d career_bazaar > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U career_user -d career_bazaar < backup_file.sql
```

## Troubleshooting

### Common Issues

1. **Port 5000 in use**: Change PORT in .env file
2. **Database connection failed**: Check DATABASE_URL and PostgreSQL service
3. **Permission denied**: Check file ownership with `sudo chown -R $USER:$USER /var/www/career-bazaar`
4. **Build fails**: Check Node.js version and dependencies

### Useful Commands

```bash
# Check application logs
pm2 logs career-bazaar --lines 100

# Check system resources
htop
df -h
free -h

# Check running processes
ps aux | grep node

# Check network connections
netstat -tlnp | grep :5000
```

## Security Checklist

- [ ] Strong passwords for database user
- [ ] Secure SESSION_SECRET key
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Regular security updates
- [ ] Regular database backups
- [ ] Non-root user for application
- [ ] Nginx security headers configured

Your Career-Bazaar application should now be running on your Digital Ocean droplet!