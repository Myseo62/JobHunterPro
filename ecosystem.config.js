module.exports = {
  apps: [
    {
      name: 'career-bazaar',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/career-bazaar',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};