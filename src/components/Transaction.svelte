<script>
  import Avatar from "$components/Avatar";
  import { addresses, psbt, user } from "$lib/store";
  import reverse from "buffer-reverse";
  import { electrs } from "$lib/api";
  import { getAddress, parseVal, parseAsset } from "$lib/wallet";
  import { Psbt } from "@asoltys/liquidjs-lib";
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

  let ins, outs, totals, senders, recipients, tx, showDetails, users;
  $: init($psbt);
  let init = async (p) => {
    if (!p) return;

    ins = [];
    outs = [];

    try {
      tx = p.extractTransaction();
    } catch (e) {
      tx = p.__CACHE.__TX;
    }

    totals = {};
    senders = {};
    recipients = {};
    users = {};

    for (let i = 0; i < tx.ins.length; i++) {
      let { hash, index } = tx.ins[i];
      let txid = reverse(hash).toString("hex");
      let input = (await electrs.url(`/tx/${txid}`).get().json()).vout[index];
      input.signed =
        !!p.data.inputs[i].partialSig || !!p.data.inputs[i].finalScriptSig;
      input.pSig = !!p.data.inputs[i].partialSig;
      input.txid = txid;
      input.index = index;

      ins = [...ins, input];

      let { asset, scriptpubkey_address: address } = input;
      let user = addressLabel(address);
      users[user] = addressUser(address);

      if (!totals[user]) totals[user] = {};
      if (!totals[user][asset]) totals[user][asset] = 0;
      totals[user][asset] += input.value;
      senders[user] = true;
    }

    outs = tx.outs.map((out) => {
      let address;

      try {
        address = getAddress(out);
      } catch (e) {
        if (!out.script.length) address = "Fee";
        else return;
      }

      let user = addressLabel(address);
      let asset = parseAsset(out.asset);
      let value = parseVal(out.value);

      users[user] = addressUser(address);

      if (!totals[user]) totals[user] = {};
      if (!totals[user][asset]) totals[user][asset] = 0;
      totals[user][asset] -= value;
      if (totals[user][asset] < 0) recipients[user] = true;

      return {
        value,
        asset,
        address,
      };
    });
  };

  let base64;
  $: read(base64);
  let read = (base64) => base64 && ($psbt = Psbt.fromBase64(base64));
</script>

{#if tx}
  <div class="w-full mx-auto">
    <div class="flex flex-wrap">
      <div class="w-full sm:w-1/2">
        <h4 class="mb-2">Sending</h4>
        {#each Object.keys(totals) as user}
          {#if senders[user] && user !== 'Fee'}
            <div class="flex mb-2">
              {#if users[user]}
                <Avatar user={users[user]} />
              {/if}
              <div class="flex ml-2 flex-grow sm:pr-8">
                {#if users[user]}
                  <div class="my-auto">
                    <a href={`/user/${users[user].id}`} class="secondary-color">
                      {user}
                    </a>
                  </div>
                {:else}
                  <div>{user}</div>
                {/if}
                <div class="ml-auto">
                  {#each Object.keys(totals[user]) as asset}
                    {#if totals[user][asset] > 0}
                      <div class="flex break-all mb-2">
                        <div class="ml-auto mr-1">
                          {val(asset, Math.abs(totals[user][asset]))}
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
        {#each Object.keys(totals) as user}
          {#if recipients[user] && user !== 'Fee'}
            <div class="flex mb-2">
              {#if users[user]}
                <div class="mb-auto">
                  <Avatar user={users[user]} />
                </div>
              {/if}
              <div class="flex ml-2 flex-grow">
                {#if users[user]}
                  <div class="my-auto">
                    <a href={`/user/${users[user].id}`} class="secondary-color">
                      {user}
                    </a>
                  </div>
                {:else}
                  <div>{user}</div>
                {/if}
                <div class="ml-auto">
                  {#each Object.keys(totals[user]) as asset}
                    {#if totals[user][asset] < 0}
                      <div class="flex break-all mb-2">
                        <div class="mx-auto mr-1">
                          {val(asset, Math.abs(totals[user][asset]))}
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
    </div>

    {#if totals['Fee']}
      <div class="flex mt-6">
        <h4 class="mr-1">Fee</h4>
        <div>{val(btc, Math.abs(totals['Fee'][btc]))} BTC</div>
      </div>
    {/if}

    <div
      class="text-xs my-6 cursor-pointer"
      on:click={() => (showDetails = !showDetails)}>
      View details
      <i class="fas fa-chevron-down ml-2" />
    </div>

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

                <div class="mb-2">
                  {input.value}
                  <a
                    href={`${explorer}/asset/${input.asset}`}
                    class="secondary-color">{input.asset}</a>
                </div>
                <div class="mb-2">Prevout: {input.txid}:{input.index}</div>

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
                    <a
                      href={`${explorer}/asset/${out.asset}`}
                      class="secondary-color">{out.asset}</a>
                  </div>
                  <div>
                    <a
                      href={`${explorer}/address/${out.address}`}
                      class="secondary-color">{out.address}</a>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
        <button class="secondary-btn mb-2" on:click={() => copy($psbt.toBase64())}>Copy PSBT Base64</button>
        <button class="primary-btn mb-2a" on:click={() => copy(tx.toHex())}>Copy Tx Hex</button>
      </div>
    {/if}
  </div>
{/if}
