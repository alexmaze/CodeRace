module.exports = {
  apps: [
    {
      name: "code-race-api",
      script: "dist/main.js",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: "monitor",
      key: "~/.ssh/id_rsa",
      ref: "origin/master",
      repo: "git@github.com:yanhao1991/CodeRace.git",
      path: "/var/www/coderace-api",
      "pre-setup": "git reset --hard HEAD",
      "post-deploy":
        "cd server && yarn && ln -sf /home/qvm/configs/coderace.json ./config/production.json && npm run build && pm2 reload ecosystem.config.js --env production",
    },
  },
}
