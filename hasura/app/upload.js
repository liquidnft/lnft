const fs = require("fs");
const ipfsClient = require("ipfs-http-client");

app.register(require("fastify-multipart"));

app.post("/upload", async function (req, res) {
  const ipfs = ipfsClient(process.env.IPFS_URL);
  const data = await req.file();
  let { cid } = await ipfs.add(data.file);
  let name = cid.toString();
  res.send(name);
});
