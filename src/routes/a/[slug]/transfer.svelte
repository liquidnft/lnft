<script context="module">
  export async function load({ fetch, page, session }) {
    if (!(session && session.user)) return {
      status: 302,
      redirect: '/login'
    } 

    const props = await fetch(`/artworks/${page.params.slug}.json`).then((r) =>
      r.json()
    );

    return {
      props,
    };
  }

</script>

<script>
  import { Avatar, ProgressLinear } from "$comp";
  import AutoComplete from "simple-svelte-autocomplete";
  import { addresses, art, psbt, user, token } from "$lib/store";
  import { err, goto, info } from "$lib/utils";
  import { updateArtwork } from "$queries/artworks";
  import { createTransaction } from "$queries/transactions";
  import { api, query } from "$lib/api";
  import { page } from "$app/stores";
  import {
    broadcast,
    isMultisig,
    requestSignature,
    pay,
    sign,
  } from "$lib/wallet";
  import { requirePassword } from "$lib/auth";

  export let artwork;

  $: disabled = !recipient;

  let recipient;

  let loading;

  let send = async (e) => {
    await requirePassword();

    loading = true;
    try {
      let address = artwork.has_royalty
        ? recipient.multisig
        : recipient.address;
      $psbt = await pay(artwork, address, 1);
      await sign();

      if (artwork.has_royalty) {
        $psbt = await requestSignature($psbt);
      }

      await broadcast();

      let transaction = {
        amount: 1,
        artwork_id: artwork.id,
        asset: artwork.asset,
        hash: $psbt.extractTransaction().getId(),
        psbt: $psbt.toBase64(),
        type: "transfer",
      };

      query(createTransaction, { transaction });

      await api
        .auth(`Bearer ${$token}`)
        .url("/transfer")
        .post({ address, id: recipient.id, transaction })
        .json();

      query(updateArtwork, {
        artwork: {
          owner_id: recipient.id,
        },
        id: artwork.id,
      }).catch(err);

      info(`Artwork sent to ${recipient.username}!`);
      goto(`/a/${artwork.slug}`);
    } catch (e) {
      err(e);
    }
    loading = false;
  };

</script>

<style>
  .disabled {
    @apply text-gray-400 border-gray-400;
  }

  :global(.huh) {
    @apply rounded-lg px-8 py-4 text-black w-full !important;
  }

</style>

{#if $addresses}
<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <h2 class="mb-4">Transfer Artwork</h2>

  {#if loading}
    <ProgressLinear />
  {:else}
    <div class="w-full max-w-lg text-center my-8 mx-auto">
      <AutoComplete
        hideArrow={true}
        placeholder="Recipient"
        items={$addresses.filter((a) => a.id !== $user.id)}
        className="w-full"
        inputClassName="huh"
        labelFieldName="username"
        bind:selectedItem={recipient}>
        <div class="flex" slot="item" let:item let:label>
          <Avatar class="my-auto" user={item} />
          <div class="ml-1 my-auto">{item.username}</div>
        </div>
      </AutoComplete>
    <a
      href="/"
      on:click|preventDefault={send}
      class:disabled
      class="block mt-8 text-center text-sm secondary-btn w-full">Send</a>
    </div>

  {/if}
</div>
{/if}
