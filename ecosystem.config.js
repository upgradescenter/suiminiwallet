module.exports = {
  apps: [{
    name: 'sui-mini-wallet',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/sui-mini-wallet',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}