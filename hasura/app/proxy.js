import proxy from "fastify-http-proxy";
import httpProxy from "http-proxy";
import { app } from "./app.js";

const { LIQUID_ELECTRS_URL, HBP_URL, IPFS_WEB_URL, HASURA_URL } = process.env;

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
  upstream: HASURA_URL,
  prefix: "/v1",
  rewritePrefix: "/v1",
});

app.register(proxy, {
  upstream: IPFS_WEB_URL,
  prefix: "/ipfs",
  rewritePrefix: "/ipfs",
});

app.register(proxy, {
  upstream: HBP_URL,
  prefix: "/storage",
  rewritePrefix: "/storage",
});

app.register(proxy, {
  upstream: HBP_URL,
  prefix: "/auth",
  rewritePrefix: "/auth",
});
