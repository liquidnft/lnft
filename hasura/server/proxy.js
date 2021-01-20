const wretch = require("wretch");
const fetch = require("node-fetch");
const FormData = require("form-data");

wretch().polyfills({
  fetch: fetch,
  FormData: FormData,
  URLSearchParams: require("url").URLSearchParams,
});

wretch()
  .url(
    "https://blockstream.info/liquid/api/address/GyFMHjB2Yme4rVnx2QhwRDJiKBxSTkWAYe/utxo"
  )
  .get()
  .json(console.log);

var httpProxy = require("http-proxy");
httpProxy
  .createProxyServer({
    target:
      "https://blockstream.info/liquid/api",
    changeOrigin: true
  })
  .listen(8002);
