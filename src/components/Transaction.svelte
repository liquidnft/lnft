<script>
  import Avatar from "$components/Avatar";
  import { addresses, psbt } from "$lib/store";
  import Check from "$icons/check";
  import reverse from "buffer-reverse";
  import { electrs } from "$lib/api";
  import { getAddress, parseVal, parseAsset } from "$lib/wallet";
  import {
    explorer,
    addressLabel,
    addressUser,
    assetLabel,
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
</script>

{#if tx}
  <div class="w-full mx-auto">
    <div class="flex gap-8">
      <div class="w-1/2">
        <h4 class="mb-2">Sending</h4>
        {#each Object.keys(totals) as user}
          {#if senders[user] && user !== 'Fee'}
            <div class="flex">
              <div class="mb-auto">
                <Avatar src={users[user].avatar_url} />
              </div>
              <div class="flex ml-1 flex-grow">
                <div>
                  <a href={`/user/${users[user].id}`} class="secondary-color">
                    {user}
                  </a>
                </div>
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

      <div class="w-1/2">
        <h4 class="mb-2">Receiving</h4>
        {#each Object.keys(totals) as user}
          {#if recipients[user] && user !== 'Fee'}
            <div class="flex">
              <div class="mb-auto">
                <Avatar src={users[user].avatar_url} />
              </div>
              <div class="flex ml-1 flex-grow">
                <div>
                  <a href={`/user/${users[user].id}`} class="secondary-color">
                    {user}
                  </a>
                </div>
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

    {#if showDetails}
      <div class="font-bold text-xs">Transaction ID</div>
      <div class="mb-4 break-all text-wrap">
        <a
          href={`${explorer}/tx/${tx.getId()}`}
          class="text-green-400"
          target="_blank">
          {tx.getId()}
        </a>
      </div>

      <div class="font-bold text-xs">Inputs</div>
      <div class="flex break-all mb-2 text-sm">
        <div class="w-1/6">Value</div>
        <div class="mr-2">Asset</div>
      </div>

      {#each ins as input (`${input.txid}:${input.index}`)}
        <div class="flex break-all mb-2 text-sm">
          <div class="w-1/6">{input.value}</div>
          <div class="mr-2">{assetLabel(input.asset)}</div>
          <div class="text-right flex-grow">
            {addressLabel(input.scriptpubkey_address)}
          </div>
          <div class="text-right flex-grow">
            {#if input.signed}
              <div class="ml-auto" style="max-width: 20px">
                <Check color={input.pSig ? 'orange' : '#32c671'} />
              </div>
            {/if}
          </div>
        </div>
      {/each}
      <div class="font-bold text-xs">Outputs</div>
      <div class="flex break-all mb-2 text-sm">
        <div class="w-1/6">Value</div>
        <div class="mr-2">Asset</div>
        <div class="text-right flex-grow">Recipient</div>
      </div>
      {#each outs as out}
        <div class="flex break-all mb-2 text-sm">
          <div class="w-1/6">{out.value}</div>
          <div class="mr-2">{assetLabel(out.asset)}</div>
          <div class="text-right flex-grow">{addressLabel(out.address)}</div>
        </div>
      {/each}
      {#if !summary}
        <div class="font-bold text-xs">Size</div>
        <div class="mb-4">{tx.virtualSize()}</div>
        <div class="font-bold text-xs">Weight</div>
        <div class="mb-4">{tx.weight()}</div>

        <div class="font-bold text-xs">Tx Hex</div>
        <div class="font-mono w-full text-xs text-wrap break-all mb-4">
          {tx.toHex()}
        </div>

        <div class="font-bold text-xs">PSBT Base64</div>
        <div class="font-mono w-full text-xs text-wrap break-all">
          {$psbt.toBase64()}
        </div>
      {/if}
    {/if}
  </div>
{/if}
