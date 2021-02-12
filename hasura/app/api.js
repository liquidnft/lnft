const wretch = require("wretch");
const fetch = require("node-fetch");
wretch().polyfills({ fetch });
const { HASURA_SECRET, HASURA_URL } = process.env;

const hasura = wretch()
  .url(HASURA_URL)
  .headers({ "x-hasura-admin-secret": HASURA_SECRET });

const electrs = wretch().url("http://electrs-liquid:3002");
const registry = wretch().url("https://assets.blockstream.info/");

module.exports = { hasura, electrs, registry };
