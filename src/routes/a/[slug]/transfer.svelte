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

  $: disabled = !recipient && !destination;

  let recipient;
  let destination = "";

  let loading;

  let send = async (e) => {
    await requirePassword($session);

    loading = true;

    function checkUser() {
      $addresses.filter(function (el) {
        return el.address === destination;
      });
    }

    if (checkUser()) {
      recipient = checkUser()[0];
    }

    if (recipient && recipient !== "null") {
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
    } else if (destination.length > 0) {
      if (artwork.has_royalty) {
        throw new Error(
          "Cannot send artworks with royalties off the platform."
        );
      } else {
        try {
          let address = destination;
          $psbt = await pay(artwork, address, 1);
          await sign();

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
            .post({ address, id: uuidv4(), transaction })
            .json();

          query(updateArtwork, {
            artwork: {
              owner_id: destination,
            },
            id: artwork.id,
          }).catch(err);

          info(`Artwork sent to ${destination}!`);
          goto(`/a/${artwork.slug}`);
        } catch (e) {
          err(e);
        }
      }
    }
    loading = false;
  };

  console.log($addresses);
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
          value={recipient !== "null" ? "" : destination}
          on:change={(e) => {
            recipient = "null";
            destination = e.target.value;
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
