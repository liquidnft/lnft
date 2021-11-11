module.exports = {
  apps: [
    {
      name: "raretoshi",
      watch: ["src"],
      script: "node",
      args: "build",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
