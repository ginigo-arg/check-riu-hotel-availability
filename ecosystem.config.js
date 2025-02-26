module.exports = {
  apps: [
    {
      name: "riu-checker",
      script: "./checkRiuAvailability.js",
      watch: false,
      instances: 1,
      exec_mode: "fork",
      cron_restart: "*/30 * * * *", // Reinicia cada 30 minutos
      autorestart: true,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
