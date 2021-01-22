<script>
  import { page } from "$app/stores";
  import { electrs } from "$lib/api";
  import { onMount, tick } from "svelte";
  import { poll, snack, password, user, token, prompt, psbt } from "$lib/store";
  import { ProgressLinear, SignaturePrompt } from "$comp";
  import { getArtworks } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import reverse from "buffer-reverse";
  import {
    btc,
    sats,
    units,
    tickers,
    requireLogin,
    requirePassword,
  } from "$lib/utils";
  import { broadcast, pay, keypair, payment, unblind } from "$lib/wallet";

  $: requireLogin($page);

  let loading = true;
  let amount = 0.0001;
  let fee = 0.00001;
  let to = "XXUnXi5z8AJnPQznxeQcbmZi83aBaiHaxY";
  let asset = btc;
  let name = (asset) => {
    let artwork = artworks.find((a) => a.asset === asset);
    if (artwork) return artwork.title;
    return tickers[asset] ? tickers[asset].ticker : asset.substr(0, 12);
  };

  let artworks = [];
  $: if ($user)
    subscription(operationStore(getArtworks), async (_, data) => {
      await new Promise((resolve) =>
        user.subscribe((value) => value && resolve())
      );
      artworks = data.artworks.filter((a) => a.owner_id === $user.id);
      if ($user.address) getUtxos($user.address);
    });

  $: [_, val, _] = units(asset);

  let init = async () => {
    $poll = setInterval(() => getUtxos($user.address), 5000);
  };

  $: if ($user && loading) init();

  let utxos = [];
  let assets = [];
  let unblinded = {};

  let getUtxos = async (address) => {
    utxos = await electrs.url(`/address/${address}/utxo`).get().json();
    await requirePassword();

    for (let i = 0; i < utxos.length; i++) {
      if (utxos[i].asset) break;
      let { txid, vout } = utxos[i];
      if (!unblinded[txid]) {
        let hex = await electrs.url(`/tx/${txid}/hex`).get().text();
        unblinded[txid] = unblind(hex, vout);
      }
      utxos[i] = unblinded[txid];
    }

    assets = utxos
      .map(({ asset }) => ({ name: name(asset), asset }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => (a.name.length === 12 ? 1 : -1))
      .filter(
        (item, pos, ary) =>
          item &&
          item.asset !== btc &&
          (!pos || item.asset != ary[pos - 1].asset)
      );

    loading = false;
  };

  let balances, pending;
  $: {
    balances = {};
    pending = {};
    utxos.map((u) => {
      if (u.status.confirmed) {
        if (balances[u.asset]) balances[u.asset] += u.value;
        else balances[u.asset] = u.value;
      } else {
        if (pending[u.asset]) pending[u.asset] += u.value;
        else pending[u.asset] = u.value;
      }
    });
  }

  let sign = async () => {
    $prompt = SignaturePrompt;
    try {
      await new Promise((resolve, reject) =>
        prompt.subscribe((value) => {
          !value && reject();
          value === "success" && resolve();
        })
      );
      await tick();

      return true;
    } catch (e) {
      return false;
    }
  };

  let send = async (e) => {
    e.preventDefault();
    try {
      $psbt = await pay(asset, to, sats(asset, amount), sats(btc, fee));
    } catch (e) {
      $snack = e.message;
      return;
    }
    if (!(await sign())) return;
    await broadcast($psbt);
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

{#if loading}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{:else}
  <div class="mb-2">
    <div class="text-sm text-gray-600">Address</div>
    {$user.address}<br />
  </div>
  <div class="mb-2">
    <div class="text-sm text-gray-600">Confidential Address</div>
    {$user.confidential}
  </div>
  <div class="mb-2">
    <div class="text-sm text-gray-600">Balance</div>
    {val(balances[asset] || 0)}
  </div>
  <div class="mb-2">
    <div class="text-sm text-gray-600">Pending</div>
    {val(pending[asset] || 0)}
  </div>

  <form class="w-full md:w-1/2 mb-6" on:submit={send} autocomplete="off">
    <div class="flex flex-col mb-4">
      <label>Asset</label>
      <select bind:value={asset}>
        <option value={btc}>BTC</option>
        {#each assets as asset}
          <option value={asset.asset}>{asset.name}</option>
        {/each}
      </select>
    </div>
    <div class="flex flex-col mb-4">
      <label>Amount</label>
      <input placeholder={val(0)} bind:value={amount} />
    </div>
    <div class="flex flex-col mb-4">
      <label>Fee</label>
      <input placeholder="Fee" bind:value={fee} />
    </div>
    <div class="flex flex-col mb-4">
      <label>Recipient Address</label>
      <input placeholder="Address" bind:value={to} />
    </div>
    <button type="submit">Send</button>
  </form>
{/if}
