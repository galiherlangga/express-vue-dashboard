module.exports = {
  apps: [{
    name: "express-backend",
    script: "src/app.js",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: "production"
    }
  }]
}