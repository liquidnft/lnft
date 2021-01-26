<script>
  import { goto } from "$lib/utils";
  import { page } from "$app/stores";
  import { electrs } from "$lib/api";
  import { onMount, tick } from "svelte";
  import {
    asset,
    poll,
    snack,
    password,
    user,
    token,
    prompt,
    psbt,
  } from "$lib/store";
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
  let to;

  if (!$asset) $asset = btc;

  let name = (a) => {
    let artwork = artworks.find((aw) => aw.asset === a);
    if (artwork) return artwork.title;
    return tickers[a] ? tickers[a].ticker : a.substr(0, 12);
  };

  let color = (a) => {
    return "bg-" + (tickers[a] ? tickers[a].color : "gray-400");
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

  $: [_, val, _] = units($asset || btc);

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
      .map(({ asset: a }) => ({ name: name(a), asset: a, color: color(a) }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => (a.name.length === 12 ? 1 : -1))
      .filter(
        (item, pos, ary) =>
          item &&
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
      $psbt = await pay($asset, to, sats($asset, amount), sats(btc, fee));
    } catch (e) {
      $snack = e.message;
      return;
    }
    if (!(await sign())) return;
    await broadcast($psbt);
  };
</script>

<div class="container mx-auto">
  {#if loading}
    <div class="absolute top-0 w-full left-0">
      <ProgressLinear />
    </div>
  {:else}
    <div class="mb-2">
      <a href="/wallet" class="secondary-color">&lt; Back</a>
    </div>

    {#each assets as a}
      <div class="flex mb-2 cursor-pointer" on:click={() => { ($asset = a.asset); goto('/wallet'); }}>
        <div class={`${a.color} py-2`} style="width: 20px" />
        <div class="flex dark flex-grow">
          <div class="flex-grow">{a.name}</div>
          <div>{balances[a.asset]}</div>
        </div>
      </div>
    {/each}
  {/if}
</div>
