export default {
  optimizeDeps: {
    include: ['graphql-ws', 'backo2', 'eventemitter3'],
  },

  proxy: {
    '/test/(.*)': {
      target: 'http://localhost:5000',
      rewrite: path => '/fun/bun'
    },
    '/hasura/(.*)': {
      target: 'ws://localhost:8080',
      changeOrigin: true,
      rewrite: path => '/v1/graphql',
      ws: true,
    },
  }
};
