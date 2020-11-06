// Consult https://www.snowpack.dev to learn about these options
module.exports = {
  extends: "@sveltejs/snowpack-config",
  proxy: {
    "/upload": {
      target: "http://localhost:3801",
    },
  },
};
