const {
  Client: HyperspaceClient,
  Server: HyperspaceServer
} = require('hyperspace');
const Hyperdrive = require('hyperdrive');

async function main () {
  // Setup the Hyperspace Daemon connection
  // =
  const {client, cleanup} = await setupHyperspace()
  console.log('Hyperspace daemon connected, status:')
  console.log(await client.status())

  // Create a Hyperdrive
  // =
  let drive = new Hyperdrive(client.corestore())
  await drive.promises.ready()
  console.log('Drive created, key:')
  console.log('  ', drive.key.toString('hex'))

  // Swarm on the network
  // =
  await client.replicate(drive)
  await new Promise(r => setTimeout(r, 3e3)) // just a few seconds
  await client.network.configure(drive, {announce: false, lookup: false})

  // await cleanup()
}

async function setupHyperspace () {
  let client
  let server
  
  try {
    client = new HyperspaceClient()
    await client.ready()
  } catch (e) {
    // no daemon, start it in-process
    server = new HyperspaceServer()
    await server.ready()
    client = new HyperspaceClient()
    await client.ready()
  }
  
  return {
    client,
    async cleanup () {
      await client.close()
      if (server) {
        console.log('Shutting down Hyperspace, this may take a few seconds...')
        await server.stop()
      }
    }
  }
}

main()
