<script>
  import { Buffer } from "buffer";
  import { v4 } from "uuid";
  import { electrs, liquid } from "$lib/api";
  import { tick, onMount } from "svelte";
  import { user, snack, token } from "$lib/store";
  import Dropzone from "$components/Dropzone";
  import upload from "$lib/upload";
  import Form from "./_form";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import { goto } from "$app/navigation";
  import getAddress from "$lib/getAddress";
  import { ECPair, Psbt, payments, networks } from "@asoltys/liquidjs-lib";
  import reverse from "buffer-reverse";

  const network = networks.regtest;
  const btc =
    "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

  let preview;
  let filename;
  let type;
  let video;
  let hidden;
  let asset;
  let addr;
  let password = "liquidart";

  $: hidden = type && !type.includes("video");

  $: if ($user) {
    createIssuance();
  }

  let createIssuance = async () => {
    let fee = 100000;

    addr = getAddress($user.mnemonic, password);

    let { address, output, redeem } = addr;

    let utxos = await electrs.url(`/address/${address}/utxo`).get().json();
    let prevout = utxos.find((utxo) => utxo.asset === btc && utxo.value > fee);

    if (!prevout) {
      $snack = "Not enough funds";
      return;
    }

    issuance = new Psbt()
      .addInput({
        hash: prevout.txid,
        index: prevout.vout,
        nonWitnessUtxo: Buffer.from(await getHex(prevout.txid), "hex"),
        sighashType: 1,
        redeemScript: redeem.output,
      })
      // fee
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1, 0),
        script: Buffer.alloc(0),
        value: fee,
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
        script: output,
        value: prevout.value - fee,
      })
      .addIssuance({
        assetAmount: 1,
        assetAddress: address,
        tokenAmount: 0,
        precision: 0,
        net: network,
      });

    base64 = issuance.toBase64();
  };

  let previewFile = (file) => {
    filename = file.name;
    type = file.type;
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
      await tick();
      if (type.includes("video")) {
        video.src = URL.createObjectURL(file);
        video.parentElement.load();
      }
    };

    reader.readAsDataURL(file);
  };

  let percent;
  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  };

  $: width = `width: ${percent}%`;

  const uploadFile = ({ detail: file }) => {
    if (!file) return;
    previewFile(file);
    upload(file, $token, progress);
  };

  $: artwork = {
    title: "",
    description: "",
    filename,
    list_price: 10000,
    tags: {},
    asset,
  };

  let getHex = async (txid) => {
    return electrs.url(`/tx/${txid}/hex`).get().text();
  };

  const createArtwork = mutation(create);
  let createSwap = () => {
    swapTx = new Psbt()
      .addInput({
        hash: txid,
        index: 3,
        witnessUtxo: tx.outs[3],
        redeemScript: payment.redeem.output,
        sighashType:
          Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
      })
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: payment_out.output,
        value: artwork.list_price,
      })
      .signInput(0, ECPair.fromPrivateKey(key.privateKey), [
        Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
      ])
      .finalizeInput(0);
  };

  let issuance, issuanceTx, base64;
  let issue = async (e) => {
    e.preventDefault();

    await liquid.url("/broadcast").post({ hex: issuanceTx.toHex() }).text();

    ({ payment: payment_out, blindingKeyPair } = getAddress());
    ({ address: address_receive } = payment);

    artwork.id = v4();
    createArtwork({ artwork, hash: issuanceTx.getId(), id: artwork.id }).then(
      () => {
        goto("/market");
      }
    );
  };

  let sign = () => {
    issuance
      .signInput(0, ECPair.fromPrivateKey(addr.privateKey))
      .finalizeAllInputs();

    base64 = issuance.toBase64();

    issuanceTx = issuance.extractTransaction();
    asset = reverse(issuanceTx.outs[3].asset).toString("hex");
  };
</script>

<style>
  button {
    @apply block bg-green-400 hover:bg-green-600 text-white uppercase text-lg mx-auto p-4 rounded flex-1;
  }
</style>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6">Submit Artwork</h1>
</div>{#if preview}
  <div class="flex flex-wrap">
    <Form {artwork} on:submit={issue} />
    <div class="ml-2 flex-1 flex">
      <div class="mx-auto w-1/2">
        {#if type.includes('image')}<img src={preview} />{/if}
        <video controls class:hidden muted autoplay loop>
          <source bind:this={video} />
          Your browser does not support HTML5 video.
        </video>
        <div class="shadow w-full bg-grey-light mt-2 mb-2">
          <div
            class="bg-gray-800 text-xs leading-none py-2 text-center text-white"
            style={width}>
            {#if percent < 100}{percent}%{:else}Upload Complete!{/if}
          </div>
        </div>
        <div class="break-all">
          <div class="mb-2">
            PSBT
            <div
              style="max-height: 150px; overflow-y: scroll; overflow-x: hidden;"
              class="text-xs font-mono">
              {base64}
            </div>
          </div>
          {#if artwork.asset}
            <div>
              Asset ID
              <div class="text-xs font-mono">{artwork.asset}</div>
            </div>
          {:else}
            <label>Password</label>
            <input bind:value={password} placeholder="Password" class="mb-2" />
            <button on:click={sign}>Sign Transaction</button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <Dropzone on:file={uploadFile} />
{/if}
