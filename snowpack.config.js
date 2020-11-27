// Consult https://www.snowpack.dev to learn about these options
module.exports = {
  extends: "@sveltejs/snowpack-config",
  plugins: ["@snowpack/plugin-dotenv"],
  proxy: {
    "/api": {
      target: "http://localhost:3400",
      on: {
        proxyReq: (p, req, res) => {
          p.path = req.url.replace("/api", "");
        },
      },
    },
    "/liquid": {
      target: "http://localhost:3012",
      on: {
        proxyReq: (p, req, res) => {
          p.path = req.url.replace("/liquid", "");
        },
      },
    },
  },
  mount: {
    'src/lib': '/_app/lib',
    'src/queries': '/_app/queries',
  },
  alias: {
    '$lib': './src/lib',
    '$queries': './src/queries',
    '$comp': './src/components/index.js',
  },
};
