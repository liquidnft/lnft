<script>
  import { v4 } from "uuid";
  import { liquid } from "$lib/api";
  import { tick, onMount } from "svelte";
  import { token } from "$lib/store";
  import Dropzone from "$components/Dropzone";
  import upload from "$lib/upload";
  import Form from "./_form";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import { goto }  from "$app/navigation";

  let preview;
  let filename;
  let type;
  let video;
  let hidden;

  $: hidden = type && !type.includes('video');

  onMount(() => {
    // get utxos
  }); 

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
  }

  $: artwork = {
    title: "",
    description: "",
    filename,
    tags: {},
  };

  const createArtwork = mutation(create);
  let issue = async (e) => {
    e.preventDefault();
    let { txid, asset } = await liquid
      .url("/asset")
      .get()
      .json();
    artwork.asset = asset;
    artwork.id = v4();
    createArtwork({ artwork, hash: txid, id: artwork.id }).then(() => {
      goto("/market");
    });

  let getHex = async (txid) => {
    return electrs.url(`/tx/${txid}/hex`).get().text();
  };

    const prevout = utxos[address][0];
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

    txid = await liquid.url("/broadcast").post({ hex }).text();
    hex = issuance.extractTransaction().toHex();
  };
</script>

<style>
  img {
    max-width: 300px;
  }
</style>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6">Submit Artwork</h1>
</div>

{#if preview}
  <div class="flex flex-wrap">
    <Form {artwork} on:submit={issue} />
    <div class="ml-2 text-center flex-1 flex">
      <div class="mx-auto">
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
      </div>
    </div>
  </div>
{:else}
  <Dropzone on:file={uploadFile} />
{/if}
