<script>
  import ProgressLinear from "$components/ProgressLinear";
  import { onMount, tick } from "svelte";
  import qrcode from "qrcode-generator-es6";
  import { balances, pending, prompt, error, user, token } from "$lib/store";
  import { assetLabel, btc, copy, err, fullscreen, val } from "$lib/utils";
  import { getBalances } from "$lib/wallet";
  import { api } from "$lib/api";

  let loading;
  let amount;
  $: amount = val(
    $error.asset,
    $error.asset === btc ? Math.max($error.amount, 1000) + fee : $error.amount
  );
  let url = `liquidnetwork:${$user.address}?amount=${amount}`;

  let img;

  $: updateAddress(address);

  let updateAddress = (address) => {
    if (!address) return;
    const qr = new qrcode(0, "H");
    if (address.startsWith("bc"))
      address = `bitcoin:${address}?amount=${amount}`;
    qr.addData(address);
    qr.make();
    img = qr.createSvgTag({});
  };

  onMount(async () => {
    await getBalances();
    await tick();
  });

  $: current = ($balances && $balances[$error.asset]) || 0;
  $: incoming = ($pending && $pending[$error.asset]) || 0;

  export let submit = (e) => {
    if (e) e.preventDefault();
    $prompt = undefined;
  };

  let fee = 0;
  let bitcoin = async () => {
    fee = 0;
    loading = true;
    try {
      ({ address, fee } = await api
        .url("/bitcoin")
        .auth(`Bearer ${$token}`)
        .post({
          amount: Math.max($error.amount, 1000),
          liquidAddress: $user.address,
        })
        .json());
    } catch (e) {
      err(e);
    }
    loading = false;
  };

  let liquid = () => {
    fee = 0;
    address = $user.address;
  };

  let lightning = async () => {
    fee = 0;
    loading = true;
    try {
      ({ address, fee } = await api
        .url("/lightning")
        .auth(`Bearer ${$token}`)
        .post({
          amount: Math.max($error.amount, 1000),
          liquidAddress: $user.address,
        })
        .json());
    } catch (e) {
      err(e);
    }

    loading = false;
  };

  let address;
  $: if ($user) address = $user.address;
</script>

<svelte:options accessors={true} />
<div class="mb-2 rounded-lg">
  <div class="flex justify-between place-items-center text-gray-400">
    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
      Add Funds
    </h3>
    <button
      class="text-gray-400 text-xl"
      on:click={() => ($prompt = undefined)}><i class="fas fa-times" /></button>
  </div>
  <div class="text-center text-sm mt-6">Funds Required</div>
  <div class="text-center text-xl">{amount} {assetLabel($error.asset)}</div>
  <div class="text-center text-sm mt-6">Current Balance</div>
  <div class="text-center text-xl">
    {val($error.asset, parseInt(current))}
    {#if incoming}
      <span class="text-yellow-500 text-sm">
        +{val($error.asset, parseInt(incoming))}
      </span>
    {/if}
    {assetLabel($error.asset)}
  </div>
  <div class="mb-2 flex justify-center flex-col">
    <div class="flex mb-2 mx-auto w-4/5" class:invisible={loading}>
      {@html img}
    </div>
    {#if loading}
      <ProgressLinear />
    {:else}
      <div
        class="text-center text-sm text-gray-500 break-all"
        class:invisible={loading}>
        {address}
      </div>
      <button
        on:click={() => copy(address)}
        class="center font-medium secondary-color">COPY ADDRESS
        <i class="far fa-clone ml-2" /></button>
    {/if}

    {#if $error.asset === btc}
      <div class="flex justify-center text-center">
        <button
          on:click={bitcoin}
          class="mr-2 center font-medium secondary-color">Bitcoin
        </button>
        <button
          on:click={liquid}
          class="mr-2 center font-medium secondary-color">Liquid
        </button>
        <button
          on:click={lightning}
          class="center font-medium secondary-color">Lightning
        </button>
      </div>
    {/if}
  </div>
</div>
