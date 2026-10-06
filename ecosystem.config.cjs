module.exports = {
  apps: [
    {
      name: "tashih-web",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3031 -H 127.0.0.1",
      env: { NODE_ENV: "production", TASHIH_API_URL: "http://127.0.0.1:8010" },
      instances: 1,
      autorestart: true,
      max_memory_restart: "600M",
      kill_timeout: 8000,
      time: true,
    },
  ],
};
