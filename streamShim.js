export default () => ({
  name: "shim",

  config: (config) => {
    if (!config) config = {};
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    // Node style imports are used throughout the library,
    // these are browser compatible versions. Webpack 4 used
    // to shim these automatically, but increasingly modern
    // build tools don't, as we shouldn't be dropping server
    // shims into browsers.
    //
    // I agree, and we should be working to actually fix React PDF
    // but this shim keeps us working as we do.
    if (Array.isArray(config.resolve.alias)) {
      config.resolve.alias.push(
        {
          find: "process",
          replacement: "process/browser",
        },
        {
          find: "stream",
          replacement: "vite-compatible-readable-stream",
        },
        {
          find: "zlib",
          replacement: "browserify-zlib",
        }
      );
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,

        process: "process/browser",
        stream: "vite-compatible-readable-stream",
        zlib: "browserify-zlib",
      };
    }
  },
});
