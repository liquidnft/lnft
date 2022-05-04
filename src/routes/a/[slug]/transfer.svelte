<script context="module">
  export async function load({ fetch, params: { slug }, session }) {
    if (!(session && session.user))
      return {
        status: 302,
        redirect: "/login",
      };

    const props = await fetch(`/artworks/${slug}.json`).then((r) => r.json());

    return {
      props,
    };
  }
</script>

<script>
  import { session } from "$app/stores";
  import { Avatar, ProgressLinear } from "$comp";
  import AutoComplete from "simple-svelte-autocomplete";
  import { addresses, art, psbt, user, token } from "$lib/store";
  import { err, goto, info } from "$lib/utils";
  import { updateArtwork } from "$queries/artworks";
  import { createTransaction } from "$queries/transactions";
  import { api, query } from "$lib/api";
  import { v4 as uuidv4 } from "uuid";
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

  $: disabled = !recipient && !address;

  let recipient;
  $: address = recipient
    ? artwork.has_royalty
      ? recipient.multisig
      : recipient.address
    : "";

  let loading;

  let send = async (e) => {
    await requirePassword($session);

    loading = true;

    try {
      $psbt = await pay(artwork, address, 1);
      await sign();

      if (artwork.held === "multisig") $psbt = await requestSignature($psbt);

      await api
        .auth(`Bearer ${$token}`)
        .url("/transfer")
        .post({ address, artwork, psbt: $psbt.toBase64() })
        .json();

      info(
        `Artwork sent to ${
          recipient ? recipient.username : `${address.slice(0, 21)}...`
        }!`
      );
      goto(`/a/${artwork.slug}`);
    } catch (e) {
      err(e);
    }

    loading = false;
  };
</script>

{#if $addresses}
  <div class="container mx-auto sm:justify-between mt-10 md:mt-20">
    <h2 class="mb-4">Transfer Artwork</h2>

    {#if loading}
      <ProgressLinear />
    {:else}
      <div class="w-full max-w-lg text-center my-8 mx-auto">
        <AutoComplete
          hideArrow={true}
          placeholder="Username"
          items={$addresses.filter((a) => a.id !== $session.user.id)}
          className="w-full"
          inputClassName="huh text-center"
          labelFieldName="username"
          bind:selectedItem={recipient}
        >
          <div class="flex" slot="item" let:item let:label>
            <Avatar class="my-auto" user={item} />
            <div class="ml-1 my-auto">{item.username}</div>
          </div>
        </AutoComplete>
        <p class="font-bold mt-10 mb-7">OR</p>

        <input
          type="text"
          class="w-full rounded-lg p-3 text-center"
          placeholder="Address"
          value={recipient ? "" : address}
          on:keyup={(e) => {
            recipient = undefined;
            address = e.target.value;
          }}
        />
        <a
          href="/"
          on:click|preventDefault={send}
          class:disabled
          class="block mt-8 text-center text-sm secondary-btn w-full">Send</a
        >
      </div>
    {/if}
  </div>
{/if}

<style>
  .disabled {
    @apply text-gray-400 border-gray-400;
  }

  :global(.huh) {
    @apply rounded-lg px-8 py-4 text-black w-full !important;
  }
</style>
