const reverse = require("buffer-reverse");
const zmq = require("zeromq");
const elements = require("elementsjs-lib");
const liquid = require("liquidjs-lib");
const network =
  liquid.networks[
    config.liquid.network === "mainnet" ? "liquid" : config.liquid.network
  ];
const { query } = require("graphqurl");

const zmqRawBlock = zmq.socket("sub");
zmqRawBlock.connect(config.liquid.zmqrawblock);
zmqRawBlock.subscribe("rawblock");

const zmqRawTx = zmq.socket("sub");
zmqRawTx.connect(config.liquid.zmqrawtx);
zmqRawTx.subscribe("rawtx");

zmqRawTx.on("message", async (topic, message, sequence) => {
  const hex = message.toString("hex");
  const unblinded = await lq.unblindRawTransaction(hex);
  const tx = await lq.decodeRawTransaction(unblinded.hex);
  const blinded = await lq.decodeRawTransaction(hex);

  Promise.all(
    tx.vout.map(async o => {
      try {
        if (!(o.scriptPubKey && o.scriptPubKey.addresses)) return;

        const { asset, value } = o;
        const address = o.scriptPubKey.addresses[0];

        const a = addresses.find(a => a.unconfidential === address);

        if (a) {
          query({
            query: `mutation update_user($value: Int!, $id: uuid!) {
              update_users_by_pk(pk_columns: { id: $id }, _inc: { balance: $value }) {
                id
              }
            }`,
            endpoint: "http://graphql-engine:8080/v1/graphql",
            headers: {
              "X-Hasura-Admin-Secret": "liquidart"
            },
            variables: {
              id: a.user_id,
              value
            }
          }).then(console.log);
        }
      } catch (e) {
        l.error("Problem processing transaction", e.message, e.stack);
      }
    })
  );
});

let queue = {};

zmqRawBlock.on("message", async (topic, message, sequence) => {
  const block = elements.Block.fromHex(message.toString("hex"), true);
  const hash = await lq.getBlockHash(block.height);
  const json = await lq.getBlock(hash, 2);

  console.log(json);
});
