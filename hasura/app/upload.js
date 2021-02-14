const fs = require("fs");
const util = require("util");
const path = require("path");
const { pipeline } = require("stream");
const pump = util.promisify(pipeline);
const ipfsClient = require("ipfs-http-client");

app.register(require("fastify-multipart"));

app.post("/upload", async function (req, res) {
  const ipfs = ipfsClient("http://ipfs:5001");
  const data = await req.file();
  let { cid } = await ipfs.add(data.file);
  let name = cid.toString();
  res.send(name);
});
