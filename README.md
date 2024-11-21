# Quisin - Restaurant Management System

A modern, full-stack restaurant management system built with React, TypeScript, and Node.js.

## System Requirements

- Node.js 18.x or higher
- NPM 9.x or higher
- PostgreSQL 14.x or higher
- Nginx (for reverse proxy)
- PM2 (for process management)

## Database Setup

1. Install PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo dnf install postgresql postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. Create database and user:
```bash
sudo -u postgres psql

CREATE DATABASE quisin;
CREATE USER quisin_user WITH ENCRYPTED PASSWORD 'Telemux01';
GRANT ALL PRIVILEGES ON DATABASE quisin TO quisin_user;
\q
```

3. Configure environment variables:
```bash
# Create .env file
echo "DATABASE_URL=postgres://quisin_user:your_password@localhost:5432/quisin" > .env
```

## Server Setup

1. Update and upgrade your system:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Node.js and NPM:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. Install Nginx:
```bash
sudo apt install nginx -y
```

4. Install PM2 globally:
```bash
sudo npm install -g pm2
```

## Application Deployment

1. Clone the repository:
```bash
git clone <your-repository-url>
cd quisin
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the application with PM2:
```bash
# Start the backend server
pm2 start npm --name "quisin-api" -- start

# Serve the frontend build
pm2 serve dist 3001 --name "quisin-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Nginx Configuration

1. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/quisin
```

2. Add the following configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/quisin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Configuration (Recommended)

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your_domain.com
```

## Security Setup

1. Configure UFW firewall:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. Set up fail2ban:
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Database Backup

1. Create a backup script:
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U quisin_user quisin > "$BACKUP_DIR/quisin_$TIMESTAMP.sql"
```

2. Set up a daily cron job:
```bash
sudo crontab -e
# Add the following line:
0 0 * * * /path/to/backup-script.sh
```

## Monitoring

1. Monitor application logs:
```bash
# Backend logs
pm2 logs quisin-api

# Frontend logs
pm2 logs quisin-frontend
```

2. Monitor system resources:
```bash
pm2 monit
```

## Updating the Application

1. Pull the latest changes:
```bash
git pull origin main
```

2. Install dependencies and rebuild:
```bash
npm install
npm run build
```

3. Restart the services:
```bash
pm2 restart all
```

## Troubleshooting

1. Check application logs:
```bash
pm2 logs
```

2. Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

3. Check database:
```bash
psql -U quisin_user -d quisin
\dt
\d menu_items
```

4. Verify services are running:
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

## Important Notes

1. Always backup the database before updates
2. Keep the system and dependencies updated
3. Monitor disk space regularly
4. Set up proper logging rotation
5. Implement regular security updates

## Support

For issues and support:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

[Your License] - See LICENSE file for details