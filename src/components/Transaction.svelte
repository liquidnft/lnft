<script>
  import { tick } from "svelte";
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronUp,
  } from "@fortawesome/free-solid-svg-icons";
  import { Avatar, ProgressLinear } from "$comp";
  import { addresses, psbt, user } from "$lib/store";
  import reverse from "buffer-reverse";
  import { electrs } from "$lib/api";
  import {
    getTx,
    getAddress,
    parseVal,
    parseAsset,
    broadcast,
    sign,
    requestSignature,
  } from "$lib/wallet";
  import { requirePassword } from "$lib/auth";
  import { Psbt, Transaction } from "liquidjs-lib";
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

  export let tx = undefined;
  export let debug = false;

  let ins, outs, totals, senders, recipients, showDetails, users, lock, pp, uu;
  let loading;
  $: init($psbt, $user, $addresses, tx);
  let retries = 0;
  let init = async (p, u) => {
    if (lock) return setTimeout(() => init(p, u), 50);
    lock = true;
    p = $psbt;
    u = $user;
    if (!p) return (lock = false);

    ins = [];
    outs = [];

    if (!tx) {
      try {
        tx = p.extractTransaction();
      } catch (e) {
        tx = p.data.globalMap.unsignedTx.tx;
      }
    }

    totals = {};
    senders = {};
    recipients = {};
    users = {};

    for (let i = 0; i < tx.ins.length; i++) {
      let { hash, index } = tx.ins[i];
      let txid = reverse(hash).toString("hex");
      let input = (await electrs.url(`/tx/${txid}`).get().json()).vout[index];
      input.spent = (
        await electrs.url(`/tx/${txid}/outspend/${index}`).get().json()
      ).spent;

      input.signed =
        p.data.inputs[i] &&
        (!!p.data.inputs[i].partialSig || !!p.data.inputs[i].finalScriptSig);
      input.pSig = p.data.inputs[i] && !!p.data.inputs[i].partialSig;
      input.txid = txid;
      input.index = index;

      ins = [...ins, input];

      let { asset, scriptpubkey_address: address } = input;
      let username = addressLabel(address);
      users[username] = addressUser(address);

      if (!totals[username]) totals[username] = {};
      if (!totals[username][asset]) totals[username][asset] = 0;
      totals[username][asset] += input.value;
      senders[username] = true;
    }

    for (let j = 0; j < tx.outs.length; j++) {
      let out = tx.outs[j];

      let address, asset, value;

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
      await init($psbt, $user);
    }
  };

  let signTx = async () => {
    await requirePassword();
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
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h4 class="mb-2">Sending</h4>
        {#each Object.keys(totals) as username}
          {#if senders[username] && username !== "Fee"}
            {#each Object.keys(totals[username]) as asset}
              {#if totals[username][asset] > 0}
                <div class="flex mb-2">
                  {#if users[username]}
                    <div class="my-auto flex w-48">
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
                        <a
                          href={`/u/${username.replace(" 2of2", "")}`}
                          class="secondary-color"
                        >
                          {username}
                        </a>
                      </div>
                    </div>
                  {:else}
                    <div>{username}</div>
                  {/if}
                  <div class="flex my-auto ml-auto w-48">
                    {#if val(asset, Math.abs(totals[username][asset])) !== "1"}
                      <div class="mr-1 ml-auto">
                        {val(asset, Math.abs(totals[username][asset]))}
                      </div>
                    {/if}
                    <div class="truncate ml-auto mr-2">{assetLabel(asset)}</div>
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        {/each}
      </div>

      <div>
        <h4 class="mb-2">Receiving</h4>
        {#each Object.keys(totals) as username}
          {#if recipients[username] && username !== "Fee"}
            {#each Object.keys(totals[username]) as asset}
              {#if totals[username][asset] < 0}
                <div class="flex mb-2">
                  {#if users[username]}
                    <div class="my-auto flex w-48">
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
                        <a
                          href={`/u/${username.replace(" 2of2", "")}`}
                          class="secondary-color"
                        >
                          {username}
                        </a>
                      </div>
                    </div>
                  {:else}
                    <div>{username}</div>
                  {/if}
                  <div class="flex my-auto ml-auto w-48">
                    {#if val(asset, Math.abs(totals[username][asset])) !== "1"}
                      <div class="mr-1 ml-auto">
                        {val(asset, Math.abs(totals[username][asset]))}
                      </div>
                    {/if}
                    <div class="truncate ml-auto mr-2">{assetLabel(asset)}</div>
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        {/each}

        {#if totals["Fee"]}
          <h4 class="mt-6 mb-2 text-right">Fee</h4>
          <div class="text-right">
            {val(btc, Math.abs(totals["Fee"][btc]))}
            L-BTC
          </div>
        {/if}
      </div>
    </div>

    {#if showDetails}
      <div
        class="text-xs my-6 cursor-pointer"
        on:click={() => (showDetails = !showDetails)}
      >
        <div class="flex">
          <div>Hide details</div>
          <div class="my-auto ml-1">
            <Fa icon={faChevronUp} />
          </div>
        </div>
      </div>
    {:else}
      <div
        class="text-xs my-6 cursor-pointer"
        on:click={() => (showDetails = !showDetails)}
      >
        <div class="flex">
          <div>Show details</div>
          <div class="my-auto ml-1">
            <Fa icon={faChevronDown} />
          </div>
        </div>
      </div>
    {/if}

    {#if showDetails}
      <div class="text-sm break-all text-wrap">
        <div class="font-bold text-xs">Transaction ID</div>
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
            <div class="font-bold text-xs">Size</div>
            <div class="p-4">{tx.virtualSize()} bytes</div>
          </div>
          <div class="w-1/2">
            <div class="font-bold text-xs">Weight</div>
            <div class="p-4">{tx.weight()} vbytes</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="font-bold text-xs">Inputs</div>

            {#each ins as input, i}
              <div class="mb-2 p-4">
                <div class="mb-2">Index: {i}</div>

                <div class="mb-2">
                  Status:
                  {input.signed
                    ? input.pSig
                      ? "Partially signed"
                      : "Fully signed"
                    : "Unsigned"}
                  -
                  {input.spent ? "Spent" : "Unspent"}
                </div>

                <div class="mb-2">
                  Prevout:
                  <a
                    class="secondary-color"
                    href={`${explorer}/tx/${input.txid}?output:${input.index}`}
                    >{input.txid}:{input.index}</a
                  >
                </div>

                {#if input.value && input.asset}
                  <div class="mb-2">
                    {input.value}
                    <a
                      href={`${explorer}/asset/${input.asset}`}
                      class="secondary-color">{input.asset}</a
                    >
                  </div>
                {/if}

                <div class="mb-2">
                  Address:
                  <a
                    href={`${explorer}/address/${input.scriptpubkey_address}`}
                    class="secondary-color">{input.scriptpubkey_address}</a
                  >
                </div>
              </div>
            {/each}
          </div>

          <div>
            <div class="font-bold text-xs">Outputs</div>
            {#each outs as out, i}
              {#if out}
                <div class="mb-2 p-4">
                  <div class="mb-2">Index: {i}</div>
                  {#if out.value && out.asset}
                    <div class="mb-2">
                      {out.value}
                      <a
                        href={`${explorer}/asset/${out.asset}`}
                        class="secondary-color">{out.asset}</a
                      >
                    </div>
                  {/if}
                  <div>
                    {#if out.address === "Fee"}
                      Fee
                    {:else}
                      Address:
                      <a
                        href={`${explorer}/address/${out.address}`}
                        class="secondary-color">{out.address}</a
                      >
                    {/if}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
        <button
          class="secondary-btn mb-2"
          on:click={() => copy($psbt.toBase64())}>Copy PSBT Base64</button
        >
        <button class="primary-btn mb-2a" on:click={() => copy(tx.toHex())}
          >Copy Tx Hex</button
        >
      </div>
    {/if}
  </div>
{:else if !debug}
  <ProgressLinear />
{/if}
