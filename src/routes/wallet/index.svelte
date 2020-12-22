<script>
  import { Buffer } from "buffer";
  import { generateMnemonic, mnemonicToSeedSync } from "bip39";
  import { fromSeed } from "bip32";
  import { fromSeed as slip77FromSeed } from "slip77";
  import {
    crypto,
    payments,
    ECPair,
    networks,
    Psbt,
    confidential,
    Transaction,
  } from "@asoltys/liquidjs-lib";
  import { liquid, electrs } from "$lib/api";
  // import QrCode from "svelte-qrcode";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";

  const btc =
    "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

  function randomHash(nBytes) {
    let u = new Uint8Array(nBytes);
    window.crypto.getRandomValues(u);
    return u;
  }

  let createAddress = {
    query: `mutation create_address($address: address_insert_input!) {
    insert_addresses_one(object: $address) {
      id,
      user_id
    } 
  }`,
  };

  let address,
    address2,
    unblinded,
    asset,
    txid,
    hash,
    psbt,
    ria,
    tx,
    key,
    key2,
    root,
    network,
    seed,
    decoded,
    vout,
    address_receive,
    blindingKeyPair,
    blindingKeyPair2,
    payment,
    payment2,
    payment_out,
    confidentialAddress,
    confidentialAddress2;
  let addrIndex = 0;
  let keys = [];

  let getAddress = () => {
    const hd = root.derive(addrIndex);
    keys[addrIndex] = hd;
    addrIndex++;

    let p2wpkh = payments.p2wpkh({
      pubkey: hd.publicKey,
      network,
    });

    const nodeBlinding = slip77FromSeed(seed);
    const blindingKeyPair = nodeBlinding.derive(p2wpkh.output);
    let payment = payments.p2sh({
      redeem: { output: p2wpkh.output },
      network,
      pubkey: hd.publicKey,
      // blindkey: blindingKeyPair.publicKey,
    });

    return { key: hd, payment, blindingKeyPair };
  };

  let issuance;
  let issue = async () => {
    let prevout = utxos[address][0];
    console.log("prevout", prevout);
    issuance = new Psbt()
      .addInput({
        hash: prevout.txid,
        index: prevout.vout,
        nonWitnessUtxo: Buffer.from(await getHex(prevout.txid), "hex"),
        sighashType: 1,
        redeemScript: payment.redeem.output,
      })
      // fee
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1, 0),
        script: Buffer.alloc(0),
        value: 100000,
      })
      // op_return
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: payments.embed({ data: [Buffer.alloc(1)] }).output,
        value: 0,
      })
      //change
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: payment.output,
        value: 99900000,
      })
      .addIssuance({
        assetAmount: 1,
        assetAddress: address,
        tokenAmount: 0,
        precision: 0,
        net: network,
      })
      .signInput(0, ECPair.fromPrivateKey(key.privateKey))
      .finalizeAllInputs();

    hex = issuance.extractTransaction().toHex();
  };

  onMount(async () => {
    network = networks["regtest"];
    seed = mnemonicToSeedSync(generateMnemonic());
    root = fromSeed(seed, network);

    ({ key, payment, blindingKeyPair } = getAddress());
    ({ address, confidentialAddress } = payment);

    ({
      key: key2,
      payment: payment2,
      blindingKeyPair: blindingKeyPair2,
    } = getAddress());
    ({
      address: address2,
      confidentialAddress: confidentialAddress2,
    } = payment2);
  });

  let debug = () => {
    debugger;
  };

  let swap = async () => {
    ({ payment: payment_out, blindingKeyPair } = getAddress());
    ({ address: address_receive } = payment);
    let tx = Transaction.fromHex(hex);
    console.log("swaps", payment_out, tx.outs[3], hex);
    swapTx = new Psbt()
      .addInput({
        hash: tx.getId(),
        index: 3,
        witnessUtxo: tx.outs[3],
        redeemScript: payment.redeem.output,
        sighashType: Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
      })
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: payment_out.output,
        value: 1234567,
      })
      .signInput(0, ECPair.fromPrivateKey(key.privateKey), [
        Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
      ])
      .finalizeInput(0);
  };

  let hex =
    "02000000010121986ad89c459415277ba4add13ea9dccfbf3f02bc9d64ca53c4490575e0b567000000801716001406af1f9918b03c666dd70e675ea821729ebaa850ffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000100040125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a000000125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000000000000036a01000125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000005f45a600017a91425e227c244b13898e1432657a9999d766bc363778701ce3ae144ca48884623a6d38cb76d1d7b22dfe7f2e352ce3061d66b436cfecaee0100000000000000010017a91425e227c244b13898e1432657a9999d766bc363778700000000000002483045022100f8541a9f5071f27e9251c6d85033432c9088ccaa2b47784b50b64a5f27b281d00220145498ca23db7190d7cd3ddee93c37ea6a55005c621b14517f763f6658730f89012103129adaf5ea54579af1c6fa5d0fcec94969468d1c105300d47334363aa2fe28c7000000000000000000";
  let base64 =
    "cHNldP8BAHcCAAAAAAFPgQZUGQ1bypkTZ3LSUe1STcR179Toj/r7ja3igKqBUQMAAAAA/////wEBJbJRBw4pyhkEPPM8zXMk4t2rA+zErgted8T8Dlz2yVoBAAAAAAAS1ocAF6kUyZFvYuY8HNy5gknJw5OasWyRzECHAAAAAAABAUMB94zhTYE2ms7/5G3CS0cFt62doMNc1ZCQ9FTXjU6XdSIBAAAAAlQL5AAAF6kURMycN3TufYhlCWzQmHQYi37DQo2HAQcXFgAUaKMcnxILZB1ULH4AYo1XbhKRkZwBCGsCRzBEAiAUoIJ8GJo1/WUNUwTWidL04SYFO2UIcS8ts0flBoa8VQIgdvtDHNy5o83LmIl4ypCrTpnSgP8lYV7YXIrODf/dck8BIQICrGoLe2rYijYo6wNOT2zyGoO3//hpvGfIVF+r8pnOjAAA";
  let swapTx = Psbt.fromBase64(base64);
  let addresses;
  let liquality = () => {
    window.bitcoin.enable().then(() => {
      window.bitcoin.request({ method: "wallet_getAddresses" }).then((r) => {
        addresses = r;
      });
    });
  };

  let broadcast = async () => {
    txid = await liquid.url("/broadcast").post({ hex }).text();
  };

  let utxos = [];
  let getUtxos = async (address) => {
    utxos[address] = await electrs.url(`/address/${address}/utxo`).get().json();
    return utxos;
  };

  let getHex = async (txid) => {
    return electrs.url(`/tx/${txid}/hex`).get().text();
  };

  let generate = async (address) => {
    txid = await liquid
      .url(`/generate?address=${address}`)
      .auth(`Bearer ${$token}`)
      .get()
      .text();

    setInterval(() => getUtxos(address), 2000);
  };

  $: inputs = swapTx.data.inputs;
  $: outputs = swapTx.__CACHE.__TX.outs;
  let add = async (utxo) => {
    let tx = Transaction.fromHex(await getHex(utxo.txid));

    let fee = 100000;
    let change =
      utxo.value -
      swapTx.__CACHE.__TX.outs.reduce(
        (a, b) => a + parseInt(b.value.slice(1).toString("hex"), 16),
        0
      ) -
      fee;

    swapTx
      .addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: tx.outs[utxo.vout],
        redeemScript: payment2.redeem.output,
      })
      // asset
      .addOutput({
        asset: inputs[0].witnessUtxo.asset,
        nonce: Buffer.alloc(1),
        script: payment2.output,
        value: 1,
      })
      // fee
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1, 0),
        script: Buffer.alloc(0),
        value: fee,
      })
      //change
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: payment2.output,
        value: change,
      })
      .signAllInputs(ECPair.fromPrivateKey(key2.privateKey))
      .finalizeInput(1);

    base64 = swapTx.toBase64();
    swapTx = swapTx;

    hex = swapTx.extractTransaction().toHex();
    console.log("hex", hex);
  };
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded my-4;
  }

  .stuff div {
    @apply my-4;
  }
</style>

{#if $user}
  <h1 class="title">Wallet</h1>

  <button on:click={debug}>Debug</button>
  <button on:click={() => generate(address)}>Show me the money!</button>
  <button on:click={issue}>Issue asset</button>
  <button on:click={broadcast}>Broadcast</button>
  <button on:click={swap}>Swap</button>

  <!--<QrCode value={address} />-->
  <div class="break-all p-8 stuff">
    <div>Address {address} {confidentialAddress}</div>
    {#if utxos && utxos[address]}
      {#each utxos[address] as utxo}
        <div class="flex w-full justify-center hover:bg-red cursor-pointer">
          <div class="flex-grow">Txid {utxo.txid}</div>
          <div class="flex-grow">Value {utxo.value}</div>
          <div class="flex-grow">Asset {utxo.asset.slice(0, 6)}</div>
        </div>
      {/each}
    {/if}
    <div>Txid {txid}</div>
    <div>{hex}</div>

    <h2>Inputs</h2>
    {#each inputs as input}
      <div>
        {reverse(input.witnessUtxo.asset).toString('hex')}
        -
        {parseInt(input.witnessUtxo.value.slice(1).toString('hex'), 16)}
      </div>
    {/each}

    <h2>Outputs</h2>
    {#each outputs as output}
      <div>
        {reverse(output.asset).toString('hex')}
        -
        {parseInt(output.value.slice(1).toString('hex'), 16)}
      </div>
    {/each}

    <div>
      {#if psbt}{JSON.stringify(psbt.toBuffer())}{/if}
    </div>
  </div>
  <button on:click={() => generate(address2)}>Show me the money!</button>
  <div class="break-all p-8 stuff">
    <div>Address {address2} {confidentialAddress2}</div>
    {#if utxos && utxos[address2]}
      {#each utxos[address2] as utxo}
        <div
          class="flex w-full justify-center hover:bg-red cursor-pointer"
          on:click={() => add(utxo)}>
          <div class="flex-grow">Txid {utxo.txid}</div>
          <div class="flex-grow">Value {utxo.value}</div>
          <div class="flex-grow">Asset {utxo.asset.slice(0, 6)}</div>
        </div>
      {/each}
    {/if}

    {base64}
  </div>

  <div>Balance: {$user.balance}</div>

  <button on:click={liquality}>Connect to liquality</button>
{/if}
