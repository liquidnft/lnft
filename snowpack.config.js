// Consult https://www.snowpack.dev to learn about these options
module.exports = {
	extends: '@sveltejs/snowpack-config',
  proxy: {
    "/api": {
      target: "http://localhost:3400",
      on: {
        proxyReq: (p, req, res) => {
          p.path = req.url.replace("/api", "");
        },
      },
    },
    "/electrs": {
      target: "http://localhost:3012",
      on: {
        proxyReq: (p, req, res) => {
          p.path = req.url.replace("/electrs", "");
        },
      },
    },
    "/liquid": {
      target: "http://localhost:3939",
      on: {
        proxyReq: (p, req, res) => {
          p.path = req.url.replace("/liquid", "");
        },
      },
    },
    "/esplora": {
      target: "http://localhost:5005",
      on: {
        proxyReq: (p, req, res) => {
          p.path = req.url.replace("/esplora", "");
        },
      },
    },
  },
	mount: {
		'src/components': '/_components',
    "src/lib": "/_app/lib",
    "src/queries": "/_app/queries",
	},
	alias: {
		$components: './src/components',
    $lib: "./src/lib",
    $queries: "./src/queries",
    $comp: "./src/components/index.js",
    "readable-stream": "stream",
	},
  installOptions: {
		externalPackage: [],
    polyfillNode: true,
  } 
};
