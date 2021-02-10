const proxy = require("fastify-http-proxy");

/*
httpProxy
  .createProxyServer({
    target: "https://blockstream.info/liquid/api",
    changeOrigin: true,
  })
  .listen(8092);
*/

const { LIQUID_ESPLORA_URL } = process.env;

app.register(proxy, {
  upstream: LIQUID_ESPLORA_URL,
  prefix: '/el',
  rewritePrefix: '',
})

app.register(proxy, {
  upstream: 'http://hasura:8080',
  prefix: '/v1',
  rewritePrefix: '/v1',
})

app.register(proxy, {
  upstream: 'http://ipfs:8080',
  prefix: '/ipfs',
  rewritePrefix: '/ipfs',
})

app.register(proxy, {
  upstream: 'http://hbp:3000',
  prefix: '/storage',
  rewritePrefix: '/storage',
})

app.register(proxy, {
  upstream: 'http://hbp:3000',
  prefix: '/auth',
  rewritePrefix: '/auth',
})
