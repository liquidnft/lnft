const wretch = require("wretch");
const fetch = require("node-fetch");
wretch().polyfills({ fetch });
const {
  LIQUID_ELECTRS_URL,
  HASURA_SECRET,
  HASURA_URL,
  CLOUDFLARE_TOKEN,
  CLOUDFLARE_ZONE,
} = process.env;

const hasura = wretch()
  .url(HASURA_URL)
  .headers({ "x-hasura-admin-secret": HASURA_SECRET });

const electrs = wretch().url(LIQUID_ELECTRS_URL);
const registry = wretch().url("https://assets.blockstream.info/");

const cf = wretch()
  .url(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/dns_records`
  )
  .auth(`Bearer ${CLOUDFLARE_TOKEN}`);

module.exports = { hasura, electrs, registry, cf };
