<script>
  import { onMount, tick } from "svelte";
  import qrcode from "qrcode-generator-es6";
  import { balances, pending, prompt, error, user, token } from "$lib/store";
  import { assetLabel, copy, val } from "$lib/utils";
  import { getBalances } from "$lib/wallet";
  import { api } from "$lib/api";

  let amount = val($error.asset, $error.amount);
  let url = `liquidnetwork:${$user.address}?amount=${amount}`;

  let img;

  $: updateAddress(address);

  let updateAddress = (address) => {
    const qr = new qrcode(0, "H");
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

  let btc = () => {
    address = "123";
  };

  let liquid = () => {
    address = $user.address;
  };

  let lightning = async () => {
    address = await api
      .url("/lightning")
      .auth(`Bearer ${$token}`)
      .post({ amount: $error.amount, liquidAddress: $user.address })
      .text();
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
    <button class="text-gray-400 text-xl"><i class="fas fa-times" /></button>
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
    <div class="flex mb-2">
      <div class="mx-auto w-1/2 qr mt-6 mb-3">
        {@html img}
      </div>
    </div>
    <div class="text-center text-sm text-gray-500 break-all">{address}</div>
    <button
      on:click={() => copy(address)}
      class="center font-medium secondary-color">COPY ADDRESS
      <i class="far fa-clone ml-2" /></button>

    <div class="flex justify-center text-center">
      <button
        on:click={btc}
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
  </div>
</div>
