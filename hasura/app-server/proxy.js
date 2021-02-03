const proxy = require("fastify-http-proxy");

/*
httpProxy
  .createProxyServer({
    target: "https://blockstream.info/liquid/api",
    changeOrigin: true,
  })
  .listen(8092);
*/

app.register(proxy, {
  upstream: 'http://electrs-liquid:3002',
  prefix: '/el',
  rewritePrefix: '',
})

app.register(proxy, {
  upstream: 'http://hasura:8080',
  prefix: '/v1',
  rewritePrefix: '/v1',
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
