const httpProxy = require("http-proxy");

httpProxy
  .createProxyServer({
    target: "https://blockstream.info/liquid/api",
    changeOrigin: true,
  })
  .listen(8092);
