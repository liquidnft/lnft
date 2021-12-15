const wretch = require("wretch");
const fetch = require("node-fetch");
wretch().polyfills({ fetch });
const {
  LIQUID_ELECTRS_URL,
  HASURA_SECRET,
  HASURA_URL,
  CLOUDFLARE_TOKEN,
  CLOUDFLARE_ZONE,
  COINOS_URL,
  COINOS_TOKEN,
  HBP_URL,
  IPFS_WEB_URL,
} = process.env;

const hasura = wretch().url(`${HASURA_URL}/v1/graphql`);
const api = (h) => hasura.headers(h);
const adminApi = hasura.headers({ "x-hasura-admin-secret": HASURA_SECRET });

const electrs = wretch().url(LIQUID_ELECTRS_URL);
const registry = wretch().url("https://assets.blockstream.info/");
const coinos = wretch().url(COINOS_URL).auth(`Bearer ${COINOS_TOKEN}`);
const ipfs = wretch().url(IPFS_WEB_URL);

const cf = wretch()
  .url(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/dns_records`
  )
  .auth(`Bearer ${CLOUDFLARE_TOKEN}`);

const hbp = wretch().url(HBP_URL);

module.exports = {
  hasura: adminApi,
  api,
  electrs,
  registry,
  cf,
  hbp,
  coinos,
  ipfs,
};
