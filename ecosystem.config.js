module.exports = {
  apps: [{
    name: 'portfolio-prod',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/cstate.se/portfolio',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
  }]
};
