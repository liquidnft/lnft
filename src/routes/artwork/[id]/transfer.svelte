<script>
  import { Avatar, ProgressLinear } from "$comp";
  import AutoComplete from "simple-svelte-autocomplete";
  import { addresses, art, psbt, user, token } from "$lib/store";
  import { err, goto, info } from "$lib/utils";
  import { getArtwork, updateArtwork } from "$queries/artworks";
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

  let { id } = $page.params;
  $: disabled = !selectedValue;

  let selectedValue;

  let artwork, loading;
  $: setup($token);
  let setup = async (t) => {
    if (!t) return;

    try {
      artwork = (await query(getArtwork(id))).artworks_by_pk;
    } catch (e) {
      err(e);
    }
  };

  $: loading = !$user || !$addresses;

  let send = async (e) => {
    await requirePassword();

    loading = true;
    try {
      let address = artwork.royalty
        ? selectedValue.multisig
        : selectedValue.address;
      $psbt = await pay(artwork, address, 1);
      await sign();

      if (artwork.royalty) {
        $psbt = await requestSignature($psbt);
      }

      await broadcast();

      let transaction = {
        amount: 1,
        artwork_id: id,
        asset: artwork.asset,
        hash: $psbt.extractTransaction().getId(),
        psbt: $psbt.toBase64(),
        type: "transfer",
      };

      query(createTransaction, { transaction });
      await api
        .auth(`Bearer ${$token}`)
        .url("/transfer")
        .post({ address, id: selectedValue.id, transaction })
        .json();

      query(updateArtwork, {
        artwork: {
          owner_id: selectedValue.id,
        },
        id,
      }).catch(err);

      info(`Artwork sent to ${selectedValue.username}!`);
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

<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <h2 class="mb-4">Transfer Artwork</h2>

  {#if loading}
    <ProgressLinear />
  {:else}
    <div class="w-full text-center my-8">
      <AutoComplete
        hideArrow={true}
        placeholder="Recipient"
        items={$addresses.filter((a) => a.id !== $user.id)}
        className="w-full"
        inputClassName="huh"
        labelFieldName="username"
        bind:selectedItem={selectedValue}>
        <div class="flex" slot="item" let:item let:label>
          <Avatar class="my-auto" user={item} />
          <div class="ml-1 my-auto">{item.username}</div>
        </div>
      </AutoComplete>
    </div>

    <a
      href="/"
      on:click|preventDefault={send}
      class:disabled
      class="block text-center text-sm secondary-btn w-full">Send</a>
  {/if}
</div>
