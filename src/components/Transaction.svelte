<script>
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronUp,
  } from "@fortawesome/free-solid-svg-icons";
  import Avatar from "$components/Avatar";
  import { psbt, user } from "$lib/store";
  import reverse from "buffer-reverse";
  import { electrs } from "$lib/api";
  import {
    getTx,
    getAddress,
    parseVal,
    parseAsset,
    unblind,
  } from "$lib/wallet";
  import { requirePassword } from "$lib/auth";
  import { Psbt, Transaction } from "@asoltys/liquidjs-lib";
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
  } from "$lib/utils";

  export let summary = false;
  export let tx;

  let ins, outs, totals, senders, recipients, showDetails, users, lock, pp, uu;
  $: init($psbt, $user);
  let retries = 0;
  let init = async (p, u) => {
    pp = JSON.stringify(p);
    uu = JSON.stringify(u);
    if (++retries < 5 && lock) {
      if (JSON.stringify(p) !== pp || JSON.stringify(u) !== uu)
        setTimeout(() => init(p, u), 50);
      return;
    }
    lock = true;
    if (!p) return;

    ins = [];
    outs = [];

    if (!tx) {
      try {
        tx = p.extractTransaction();
      } catch (e) {
        tx = Transaction.fromHex(
          p.data.globalMap.unsignedTx.toBuffer().toString("hex")
        );
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
      if ($user && input.assetcommitment) {
        await requirePassword();
        try {
          let { asset, value } = await unblind((await getTx(txid)).outs[index]);
          input.asset = reverse(asset).toString("hex");
          input.value = parseInt(value);
        } catch (e) {}
      }

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

      if ($user && out.rangeProof.length) {
        await requirePassword();
        try {
          ({ asset, value } = await unblind(out));
          asset = reverse(asset).toString("hex");
          value = parseInt(value);
        } catch (e) {}
      } else {
        asset = parseAsset(out.asset);
        value = parseVal(out.value);
      }

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

  let parse = () => (base64 = x);

  let base64;
  let x;
  $: read(base64);
  let read = (base64) => {
    if (base64) {
      tx = undefined;
      $psbt = Psbt.fromBase64(base64);
      init($psbt, $user);
    }
  };
</script>

<!--
<textarea bind:value={x} class="w-full" rows={20} />
<button on:click={parse}>Parse</button>
-->

{#if tx}
  <div class="w-full mx-auto">
    <div class="flex flex-wrap">
      <div class="w-full sm:w-1/2">
        <h4 class="mb-2">Sending</h4>
        {#each Object.keys(totals) as username}
          {#if senders[username] && username !== 'Fee'}
            <div class="flex mb-2">
              <div class="flex ml-2 flex-grow sm:pr-8">
                {#if users[username]}
                  <div class="mb-auto flex">
                    <div class="flex">
                      {#if users[username]}
                        <Avatar
                          user={users[username]}
                          overlay={username.includes('+ us') && '/logo-graphic.png'} />
                      {/if}
                    </div>
                    <div class="my-auto ml-2">
                      <a href={`/${username}`} class="secondary-color">
                        {username}
                      </a>
                    </div>
                  </div>
                {:else}
                  <div class="w-2/3 break-all">{username}</div>
                {/if}
                <div class="ml-auto mt-3">
                  {#each Object.keys(totals[username]) as asset}
                    {#if totals[username][asset] > 0}
                      <div class="flex break-all mb-2">
                        <div class="ml-auto mr-1">
                          {val(asset, Math.abs(totals[username][asset]))}
                        </div>
                        <div>{assetLabel(asset)}</div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>

      <div class="w-full sm:w-1/2">
        <h4 class="mb-2">Receiving</h4>
        {#each Object.keys(totals) as username}
          {#if recipients[username] && username !== 'Fee'}
            <div class="flex mb-2">
              <div class="flex ml-2 flex-grow">
                <div class="flex">
                  {#if users[username]}
                    <Avatar
                      user={users[username]}
                      overlay={username.includes('+ us') && '/logo-graphic.png'} />
                  {/if}
                </div>
                <div class="my-auto ml-2">
                  {#if users[username]}
                    <div class="my-auto">
                      <a href={`/${username}`} class="secondary-color">
                        {username}
                      </a>
                    </div>
                  {:else}
                    <div class="w-2/3 break-all">{username}</div>
                  {/if}
                </div>
                <div class="ml-auto mt-3">
                  {#each Object.keys(totals[username]) as asset}
                    {#if totals[username][asset] < 0}
                      <div class="flex break-all mb-2">
                        <div class="mx-auto mr-1">
                          {val(asset, Math.abs(totals[username][asset]))}
                        </div>
                        <div>{assetLabel(asset)}</div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/each}

        {#if totals['Fee']}
          <h4 class="mt-6 mb-2 text-right">Fee</h4>
          <div class="text-right">
            {val(btc, Math.abs(totals['Fee'][btc]))}
            L-BTC
          </div>
        {/if}
      </div>
    </div>

    {#if showDetails}
      <div
        class="text-xs my-6 cursor-pointer"
        on:click={() => (showDetails = !showDetails)}>
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
        on:click={() => (showDetails = !showDetails)}>
        <div class="flex">
          <div>Show details</div>
          <div class="my-auto ml-1">
            <Fa icon={faChevronDown} />
          </div>
        </div>
      </div>
    {/if}

    {#if showDetails}
      <div class="text-sm">
        <div class="font-bold text-xs">Transaction ID</div>
        <div class="mb-4 break-all text-wrap p-4">
          {#if ins.find((i) => !i.signed || i.pSig)}
            {tx.getId()}
          {:else}
            <a
              href={`${explorer}/tx/${tx.getId()}`}
              class="secondary-color"
              target="_blank">
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

        <div class="md:flex">
          <div class="w-1/2">
            <div class="font-bold text-xs">Inputs</div>

            {#each ins as input, i}
              <div class="break-all mb-2 p-4">
                {#if i > 0}
                  <hr />
                {/if}
                <div class="mb-2">Index: {i}</div>

                <div class="mb-2">
                  Status:
                  {input.signed ? (input.pSig ? 'Partially signed' : 'Fully signed') : 'Unsigned'}
                </div>

                <div class="mb-2">Prevout: {input.txid}:{input.index}</div>

                {#if input.value && input.asset}
                  <div class="mb-2">
                    {input.value}
                    units of
                    <a
                      href={`${explorer}/asset/${input.asset}`}
                      class="secondary-color">{input.asset}</a>
                  </div>
                {/if}

                <div class="mb-2">
                  <a
                    href={`${explorer}/address/${input.scriptpubkey_address}`}
                    class="secondary-color">{input.scriptpubkey_address}</a>
                </div>
              </div>
            {/each}
          </div>

          <div class="w-1/2">
            <div class="font-bold text-xs">Outputs</div>
            {#each outs as out, i}
              {#if i > 0}
                <hr />
              {/if}
              {#if out}
                <div class="break-all mb-2 p-4">
                  <div class="mb-2">Index: {i}</div>
                  <div class="mb-2">
                    {out.value}
                    units of
                    <a
                      href={`${explorer}/asset/${out.asset}`}
                      class="secondary-color">{out.asset}</a>
                  </div>
                  <div>
                    {#if out.address === 'Fee'}
                      Fee
                    {:else}
                      <a
                        href={`${explorer}/address/${out.address}`}
                        class="secondary-color">{out.address}</a>
                    {/if}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
        <button
          class="secondary-btn mb-2"
          on:click={() => copy($psbt.toBase64())}>Copy PSBT Base64</button>
        <button class="primary-btn mb-2a" on:click={() => copy(tx.toHex())}>Copy
          Tx Hex</button>
      </div>
    {/if}
  </div>
{/if}
