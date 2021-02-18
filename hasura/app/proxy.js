const proxy = require("fastify-http-proxy");
const httpProxy = require("http-proxy");

const { LIQUID_ELECTRS_URL } = process.env;

let p = httpProxy
  .createProxyServer({
    target: LIQUID_ELECTRS_URL,
    changeOrigin: true,
  })
  .listen(8092);

p.on("proxyReq", (pr, req, res) => {
  pr.setHeader("Content-Type", "application/json");
});

app.register(proxy, {
  upstream: "http://localhost:8092",
  prefix: "/el",
  rewritePrefix: "",
});

app.register(proxy, {
  upstream: "http://hasura:8080",
  prefix: "/v1",
  rewritePrefix: "/v1",
});

app.register(proxy, {
  upstream: "http://ipfs:8080",
  prefix: "/ipfs",
  rewritePrefix: "/ipfs",
});

app.register(proxy, {
  upstream: "http://hbp:3000",
  prefix: "/storage",
  rewritePrefix: "/storage",
});

app.register(proxy, {
  upstream: "http://hbp:3000",
  prefix: "/auth",
  rewritePrefix: "/auth",
});
