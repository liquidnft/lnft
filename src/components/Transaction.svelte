<script>
  import { session } from "$app/stores";
  import { tick } from "svelte";
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronUp,
  } from "@fortawesome/free-solid-svg-icons";
  import { Avatar, ProgressLinear } from "$comp";
  import { addresses, psbt, txcache } from "$lib/store";
  import reverse from "buffer-reverse";
  import { electrs } from "$lib/api";
  import {
    getTx,
    getAddress,
    parseVal,
    parseAsset,
    broadcast,
    network,
    sign,
    requestSignature,
  } from "$lib/wallet";
  import { requirePassword } from "$lib/auth";
  import { address as Address, Psbt, Transaction } from "liquidjs-lib";
  import {
    explorer,
    addressLabel,
    addressUser,
    artworkId,
    assetLabel,
    copy,
    ticker,
    val,
    btc,
    goto,
    info,
    err,
  } from "$lib/utils";

  export let summary;
  export let tx = undefined;
  export let debug = false;

  let ins, outs, totals, senders, recipients, showDetails, users, lock, pp, uu;
  let loading;
  $: init($psbt, $session.user, $addresses, tx);
  let retries = 0;
  let init = async (p, u) => {
    if (lock) return setTimeout(() => init(p, u), 50);
    lock = true;
    p = $psbt;
    u = $session.user;
    if (!p) return (lock = false);

    ins = [];
    outs = [];

    if (!tx) {
      try {
        tx = p.extractTransaction();
      } catch (e) {
        try {
          tx = p.data.globalMap.unsignedTx.tx;
        } catch (e) {
          err(e);
        }
      }
    }

    totals = {};
    senders = {};
    recipients = {};
    users = {};

    let address, asset, value;

    for (let i = 0; i < tx.ins.length; i++) {
      let { hash, index } = tx.ins[i];
      let txid = reverse(hash).toString("hex");
      let prev = ($txcache[txid] || (await getTx(txid))).outs[index];

      asset = parseAsset(prev.asset);
      address = Address.fromOutputScript(prev.script, network);
      value = parseVal(prev.value);

      let input = {
        address,
        asset,
        signed:
          p.data.inputs[i] &&
          (!!p.data.inputs[i].partialSig || !!p.data.inputs[i].finalScriptSig),
        pSig: p.data.inputs[i] && !!p.data.inputs[i].partialSig,
        index,
        txid,
        value,
      };

      try {
        input.spent = (
          await electrs.url(`/tx/${txid}/outspend/${index}`).get().json()
        ).spent;
      } catch (e) {
        input.spent = false;
      }

      ins = [...ins, input];

      let username = addressLabel(address);
      users[username] = addressUser(address);

      if (!totals[username]) totals[username] = {};
      if (!totals[username][asset]) totals[username][asset] = 0;
      totals[username][asset] += value;
      senders[username] = true;
    }

    for (let j = 0; j < tx.outs.length; j++) {
      let out = tx.outs[j];

      asset = parseAsset(out.asset);
      value = parseVal(out.value);

      try {
        address = getAddress(out);
      } catch (e) {
        if (!out.script.length) address = "Fee";
        else {
          outs = [
            ...outs,
            {
              value,
              asset,
              address: "",
            },
          ];
          continue;
        }
      }

      let username = addressLabel(address);
      users[username] = addressUser(address);

      if (!totals[username]) totals[username] = {};
      if (!totals[username][asset]) totals[username][asset] = 0;
      totals[username][asset] -= value;
      if (totals[username][asset] < 0) recipients[username] = true;

      outs = [
        ...outs,
        {
          value,
          asset,
          address,
        },
      ];
    }

    lock = false;
  };

  let clear = () => {
    base64 = undefined;
    $psbt = undefined;
    tx = undefined;
  };

  let parse = () => (base64 = x);

  let base64;
  let x;
  $: read(base64);
  let read = async (base64) => {
    if (base64) {
      tx = undefined;
      $psbt = Psbt.fromBase64(base64);
      await init($psbt, $session.user);
    }
  };

  let signTx = async () => {
    await requirePassword($session.jwt);
    $psbt = await sign();
    try {
      $psbt = await requestSignature($psbt);
    } catch (e) {
      console.log(`Couldn't get server signature: ${e.message}`);
    }
    info("Signed");
  };

  let broadcastTx = async () => {
    try {
      await broadcast(true);
    } catch (e) {
      err(e);
    }
  };
</script>

{#if debug}
  {#if tx}
    <div class="flex">
      <button on:click={clear} class="secondary-btn mr-2">Clear</button>
      <button on:click={signTx} class="secondary-btn mr-2">Sign</button>
      <button on:click={broadcastTx} class="secondary-btn">Broadcast</button>
    </div>
  {:else}
    <textarea bind:value={x} class="w-full" rows={14} />
    <div class="flex">
      <button on:click={parse} class="secondary-btn mr-2">Parse</button>
    </div>
  {/if}
{/if}

{#if $addresses && tx}
  <div class="w-full mx-auto">
    <div
      class="grid grid-cols-1 gap-4"
      class:sm:grid-cols-2={!summary}
      class:mt-10={summary}
    >
      <div>
        <div class="grid grid-cols-3 mb-4">
          <h4 class="mb-2 text-xs text-gray-400">Sending</h4>
          <h4 class="mb-2 text-xs text-gray-400 text-right">Amount</h4>
          <h4 class="mb-2 text-xs text-gray-400 text-right">Asset</h4>
          {#each Object.keys(totals) as username}
            {#if senders[username] && username !== "Fee"}
              {#each Object.keys(totals[username]) as asset}
                {#if totals[username][asset] > 0}
                  {#if users[username]}
                    <div class="my-auto flex">
                      <div class="flex">
                        {#if users[username]}
                          <Avatar
                            user={users[username]}
                            overlay={username.includes("2of2") &&
                              "/logo-graphic.png"}
                          />
                        {:else}
                          <Avatar
                            src="QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z"
                          />
                        {/if}
                      </div>
                      <div class="my-auto ml-2 truncate">
                        <a href={`/${username.replace(" 2of2", "")}`}>
                          {username}
                        </a>
                      </div>
                    </div>
                  {:else}
                    <div>{username}</div>
                  {/if}
                  <div class="my-auto ml-auto">
                    <div class="mr-1 ml-auto">
                      {parseFloat(
                        val(asset, Math.abs(totals[username][asset]))
                      ).toFixed(8)}
                    </div>
                  </div>
                  <div class="truncate ml-auto mr-2 my-auto">
                    {assetLabel(asset)}
                  </div>
                {/if}
              {/each}
            {/if}
          {/each}
        </div>
      </div>

      <div>
        <div class="grid grid-cols-3 mb-4">
          <h4 class="mb-2 text-xs text-gray-400">Receiving</h4>
          <h4 class="mb-2 text-xs text-gray-400 text-right">Amount</h4>
          <h4 class="mb-2 text-xs text-gray-400 text-right">Asset</h4>
          {#each Object.keys(totals) as username}
            {#if recipients[username] && username !== "Fee"}
              {#each Object.keys(totals[username]) as asset}
                {#if totals[username][asset] < 0}
                  {#if users[username]}
                    <div class="my-auto flex">
                      <div class="flex">
                        {#if users[username]}
                          <Avatar
                            user={users[username]}
                            overlay={username.includes("2of2") &&
                              "/logo-graphic.png"}
                          />
                        {:else}
                          <Avatar
                            src="QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z"
                          />
                        {/if}
                      </div>
                      <div class="my-auto ml-2 truncate">
                        <a href={`/${username.replace(" 2of2", "")}`}>
                          {username}
                        </a>
                      </div>
                    </div>
                  {:else}
                    <div>{username}</div>
                  {/if}
                  <div class="my-auto ml-auto">
                    <div class="mr-1 ml-auto">
                      {parseFloat(
                        val(asset, Math.abs(totals[username][asset]))
                      ).toFixed(8)}
                    </div>
                  </div>
                  <div class="truncate ml-auto mr-2 my-auto">
                    {assetLabel(asset)}
                  </div>
                {/if}
              {/each}
            {/if}
          {/each}
        </div>

        {#if totals["Fee"]}
          <div class="grid grid-cols-3 mb-4 w-full">
            <h4 class="my-auto text-xs text-gray-400">Fee</h4>
            <div class="my-auto ml-auto">
              {val(btc, Math.abs(totals["Fee"][btc]))}
            </div>
            <div class="truncate ml-auto mr-2 my-auto">L-BTC</div>
          </div>
        {/if}
      </div>
    </div>

    {#if showDetails}
      <div
        class="my-6 cursor-pointer"
        on:click={() => (showDetails = !showDetails)}
      >
        <button class="secondary-btn w-full"> Hide details</button>
      </div>
    {:else}
      <div
        class="my-6 cursor-pointer"
        on:click={() => (showDetails = !showDetails)}
      >
        <button class="secondary-btn w-full"> Show details </button>
      </div>
    {/if}

    {#if showDetails}
      <div class="text-sm break-all text-wrap">
        <div class="text-gray-400 text-xs">Transaction ID</div>
        <div class="mb-4 p-4">
          {#if ins.find((i) => !i.signed || i.pSig)}
            {tx.getId()}
          {:else}
            <a
              href={`${explorer}/tx/${tx.getId()}`}
              class="secondary-color"
              target="_blank"
            >
              {tx.getId()}
            </a>
          {/if}
        </div>

        <div class="flex mb-2">
          <div class="w-1/2">
            <div class="text-gray-400 text-xs">Size</div>
            <div class="p-4">{tx.virtualSize()} bytes</div>
          </div>
          <div class="w-1/2">
            <div class="text-gray-400 text-xs">Weight</div>
            <div class="p-4">{tx.weight()} vbytes</div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4" class:sm:grid-cols-2={!summary}>
          <div>
            <div class="text-gray-400 text-xs mb-2">Inputs</div>

            {#each ins as input, i}
              <div class="mb-2 p-4 border">
                <div class="ml-auto text-xs text-gray-400 text-right">{i}</div>

                <div class="mb-2 grid grid-cols-2">
                  {#if input.value}
                    <div>
                      <div class="text-gray-400 text-xs">Value</div>
                      {input.value}
                    </div>
                  {/if}
                  <div>
                    <div class="text-gray-400 text-xs">Status</div>
                    {input.signed
                      ? input.pSig
                        ? "Partially signed"
                        : "Fully signed"
                      : "Unsigned"}
                    /
                    {input.spent ? "Spent" : "Unspent"}
                  </div>
                </div>
                {#if input.asset}
                  <div class="mb-2">
                    <div class="text-gray-400 text-xs">Asset</div>
                    <a href={`${explorer}/asset/${input.asset}`}
                      >{input.asset}</a
                    >
                  </div>
                {/if}

                <div class="text-gray-400 text-xs">Address</div>
                <div class="mb-2">
                  <a href={`${explorer}/address/${input.address}`}
                    >{input.address}</a
                  >
                </div>
                <div class="mb-2">
                  <div class="text-gray-400 text-xs">Prevout</div>
                  <a href={`${explorer}/tx/${input.txid}?output:${input.index}`}
                    >{input.txid}:{input.index}</a
                  >
                </div>
              </div>
            {/each}
          </div>

          <div>
            <div class="text-gray-400 text-xs mb-2">Outputs</div>
            {#each outs as out, i}
              {#if out}
                <div class="mb-2 p-4 border">
                  <div class="ml-auto text-xs text-gray-400 text-right">
                    {i}
                  </div>
                  {#if out.value && out.asset}
                    <div class="mb-2">
                      <div class="text-gray-400 text-xs">Value</div>
                      {out.value}
                    </div>
                    <div class="mb-2">
                      <div class="text-gray-400 text-xs">Asset</div>
                      <a href={`${explorer}/asset/${out.asset}`}>{out.asset}</a>
                    </div>
                  {/if}
                  <div>
                    {#if out.address === "Fee"}
                      <div class="text-gray-400 text-xs">Fee</div>
                    {:else if out.value}
                      <div class="text-gray-400 text-xs">Address</div>
                      <a href={`${explorer}/address/${out.address}`}
                        >{out.address}</a
                      >
                    {:else}
                      <div class="text-gray-400 text-xs">OP Return</div>
                    {/if}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button
            class="secondary-btn mb-2"
            on:click={() => copy($psbt.toBase64())}>Copy PSBT Base64</button
          >
          <button class="secondary-btn mb-2" on:click={() => copy(tx.toHex())}
            >Copy Tx Hex</button
          >
        </div>
      </div>
    {/if}
  </div>
{:else if !debug}
  <ProgressLinear />
{/if}
