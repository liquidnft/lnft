<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import { Buffer } from "buffer";
  import { PasswordPrompt } from "$comp";
  import Form from "../_form";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork, updateTags } from "$queries/artworks";
  import { goto } from "$app/navigation";
  import { electrs, liquid } from "$lib/api";
  import getAddress from "$lib/getAddress";
  import {
    ECPair,
    Psbt,
    payments,
    networks,
    Transaction,
  } from "@asoltys/liquidjs-lib";
  import { password, user, token } from "$lib/store";
  import { requireLogin } from "$lib/utils";

  const btc =
    "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
  export let id;

  requireLogin($token);

  let result = subscription(operationStore(getArtwork(id)));
  $: artwork = $result.data
    ? { ...$result.data.artworks_by_pk, list_price: 500 }
    : null;

  const updateArtwork$ = mutation(updateArtwork);
  const updateTags$ = mutation(updateTags);
  let update = async (e) => {
    e.preventDefault();

    let {
      id: artwork_id,
      description,
      filename,
      list_price,
      title,
      tags,
    } = artwork;

    updateTags$({
      tags: tags.data.map(({ tag }) => ({ tag, artwork_id })),
      artwork_id,
    }).then(async () => {
      await createSwap();

      updateArtwork$({
        artwork: { description, filename, list_price, title },
        id,
      }).then(() => {
        goto(`/artwork/${artwork.id}`);
      });
    });
  };

  let getHex = async (txid) => {
    return electrs.url(`/tx/${txid}/hex`).get().text();
  };

  let createSwap = async () => {
    let { address, output, redeem, privateKey } = getAddress(
      $user.mnemonic,
      $password
    );

    let utxos = await electrs.url(`/address/${address}/utxo`).get().json();
    let prevout = utxos.find((utxo) => utxo.asset === artwork.asset);
    let prevoutTx = Transaction.fromHex(await getHex(prevout.txid));
    let sighashType =
      Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;

    let swap = new Psbt()
      .addInput({
        hash: prevoutTx.getId(),
        index: prevout.vout,
        witnessUtxo: prevoutTx.outs[prevout.vout],
        redeemScript: redeem.output,
        sighashType,
      })
      .addOutput({
        asset: btc,
        nonce: Buffer.alloc(1),
        script: output,
        value: Math.round(artwork.list_price),
      })
      .signInput(0, ECPair.fromPrivateKey(privateKey), [sighashType])
      .finalizeInput(0);

    artwork.list_price_tx = swap.toBase64();
  };
</script>

{#if artwork}
  <PasswordPrompt />
  <Form {artwork} tags={artwork.tags.map((t) => t.tag)} on:submit={update} />
{/if}
