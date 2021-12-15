const {
  Client: HyperspaceClient,
  Server: HyperspaceServer,
} = require("hyperspace");
const Hyperdrive = require("hyperdrive");

async function main() {
  // Setup the Hyperspace Daemon connection
  // =
  const { client, cleanup } = await setupHyperspace();
  console.log("Hyperspace daemon connected, status:");
  console.log(await client.status());

  // Create a Hyperdrive
  // =
  let drive = new Hyperdrive(
    client.corestore(),
    "684b79e132c9e4875aa6f18edc351b96f33721961b42fba6f74fd141947a2a32"
  );
  await drive.promises.ready();
  console.log("Drive created, key:");
  console.log("  ", drive.key.toString("hex"));

  // File reads
  // =
  console.log("readdir(/)");
  console.log("  ", await drive.promises.readdir("/"));
  console.log("readFile(/file1.txt, utf8)");
  console.log("  ", await drive.promises.readFile("/file1.txt", "utf8"));
  console.log("readFile(/stuff/file2.bin, hex)");
  console.log("  ", await drive.promises.readFile("/stuff/file2.bin", "hex"));

  // Swarm on the network
  // =
  await client.replicate(drive);
  await new Promise((r) => setTimeout(r, 3e3)); // just a few seconds
  await client.network.configure(drive, { announce: false, lookup: false });

  // await cleanup()
}

async function setupHyperspace() {
  let client;
  let server;

  try {
    client = new HyperspaceClient();
    await client.ready();
  } catch (e) {
    // no daemon, start it in-process
    server = new HyperspaceServer();
    await server.ready();
    client = new HyperspaceClient();
    await client.ready();
  }

  return {
    client,
    async cleanup() {
      await client.close();
      if (server) {
        console.log("Shutting down Hyperspace, this may take a few seconds...");
        await server.stop();
      }
    },
  };
}

main();
