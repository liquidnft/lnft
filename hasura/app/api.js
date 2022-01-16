const wretch = require("wretch");
const fetch = require("node-fetch");
const w = wretch().polyfills({ fetch });
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

const DELAY = LIQUID_ELECTRS_URL.includes("blockstream") ? 25 : 0;

const queue = [];

const enqueue = (next) => (url, opts) =>
  new Promise((r) => queue.push(() => r(next(url, opts))) && ddequeue());

let timer;
const dequeue = () => {
  if (queue.length) {
    queue.shift()();
    ddequeue();
  }
};

const ddequeue = () => {
  clearTimeout(timer);
  timer = setTimeout(dequeue, DELAY);
};

const hasura = wretch().url(`${HASURA_URL}/v1/graphql`);
const api = (h) => hasura.headers(h);
const adminApi = hasura.headers({ "x-hasura-admin-secret": HASURA_SECRET });

const electrs = wretch().middlewares([enqueue]).url(LIQUID_ELECTRS_URL);
const registry = wretch().url("https://assets.blockstream.info/");
const coinos = wretch().url(COINOS_URL).auth(`Bearer ${COINOS_TOKEN}`);
const ipfs = wretch().url(IPFS_WEB_URL);

const q = async (query, variables) => {
  let { data, errors } = await adminApi.post({ query, variables }).json();
  if (errors) {
    console.error(
      `Encountered errors while running the following query: ${query}`
    );
    console.error(`Variables: ${JSON.stringify(variables)}`);
    for (let index = 0; index < errors.length; index++) {
      const element = errors[index];
      console.error(`Error ${index + 1}: ${JSON.stringify(element)}`);
      
    }
    throw new Error(errors[0].message);
  }
  return data;
};

const cf = wretch()
  .url(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/dns_records`
  )
  .auth(`Bearer ${CLOUDFLARE_TOKEN}`);

const hbp = wretch().url(HBP_URL);

const { APP_URL } = process.env;
const lnft = wretch().url(APP_URL);

module.exports = {
  hasura: adminApi,
  api,
  electrs,
  registry,
  cf,
  hbp,
  coinos,
  ipfs,
  lnft,
  q,
  w,
};
