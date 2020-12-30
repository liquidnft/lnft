module.exports = {
  apps: [
    {
      name: "raretoshi",
      watch: ["src"],
      script: "npm",
      args: "start",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
