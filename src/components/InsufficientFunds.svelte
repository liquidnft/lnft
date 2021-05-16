<script>
  import Fa from "svelte-fa";
  import {
    faUserSecret,
    faChevronDown,
    faChevronUp,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import { faClone } from "@fortawesome/free-regular-svg-icons";
  import ProgressLinear from "$components/ProgressLinear";
  import { onMount, tick } from "svelte";
  import qrcode from "qrcode-generator-es6";
  import { balances, pending, prompt, error, user, token } from "$lib/store";
  import { assetLabel, btc, copy, err, fullscreen, val } from "$lib/utils";
  import { getBalances } from "$lib/wallet";
  import { api } from "$lib/api";

  export let hide = true;

  let tab = "liquid";

  let loading;
  let amount;
  $: amount = val(
    $error.asset,
    $error.asset === btc ? Math.max($error.amount, 1000) + fee : $error.amount
  );
  let url = `liquidnetwork:${$user.address}?amount=${amount}`;

  let img;

  let showInvoice = false;
  let toggle = () => {
    showInvoice = !showInvoice;
  };

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

  let confidential = false;
  let toggleConfidential = () => {
    confidential = !confidential;
    if (confidential) address = $user.confidential;
    else address = $user.address;
  };

  let confirming;
  let confirmed;

  $: current = ($balances && $balances[$error.asset]) || 0;
  $: incoming = ($pending && $pending[$error.asset]) || 0;
  $: incoming && (confirming = true);
  $: newBalance(current);
  let newBalance = () => {
    if (confirming) {
      confirmed = true;
      confirming = false;
    }

    if (current >= $error.amount) {
      $prompt = undefined;
    }
  };

  export let submit = (e) => {
    if (e) e.preventDefault();
    $prompt = undefined;
  };

  let fee = 0;
  let bitcoin = async () => {
    tab = "bitcoin";
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

  let liquid = async () => {
    tab = "liquid";
    fee = 0;
    loading = true;
    try {
      ({ address, fee } = await api
        .url("/liquid")
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

  let lightning = async () => {
    tab = "lightning";
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

<style>
  .hover {
    @apply border-b-2;
    border-bottom: 3px solid #6ed8e0;
  }

  .closeBtn{
    padding: 10px 13px;
  }

  .tabs div {
    @apply mb-auto h-8 mx-2 md:mx-4 mt-6;
    &:hover {
      @apply hover;
    }
  }
</style>

<svelte:options accessors={true} />

<div class="mb-2 rounded-lg">
  <div class="flex w-full">
    <h3 class="text-2xl flex-grow text-left">Add funds</h3>
    <button
      class="closeBtn text-xl ml-auto font-thin w-10 h-10 bg-gray-100 rounded rounded-full"
      on:click={() => ($prompt = undefined)}>
      <Fa icon={faTimes} />
    </button>
  </div>
  {#if incoming}
    <div class="text-xs mt-6">Unconfirmed Payment Detected</div>
    <span class="text-yellow-500 text-sm">
      +{val($error.asset, parseInt(incoming))}
      {assetLabel($error.asset)}
    </span>
  {:else}
    {#if confirmed}
      <div class="text-xs mt-6">Payment Confirmed</div>
    {/if}
    <div class="flex mt-4">
      <div class="w-1/2">
        <div class="text-xs mt-6">Current Balance</div>
        <div class="text-xl">
          {val($error.asset, parseInt(current))}
          {assetLabel($error.asset)}
        </div>
      </div>
      <div class="w-1/2">
        <div class="text-xs mt-6">Funds Required</div>
        <div class="text-xl">{amount} {assetLabel($error.asset)}</div>
      </div>
    </div>

    {#if $error.asset === btc}
      <div
        class="flex justify-center text-center cursor-pointer tabs flex-wrap">
        <div class:hover={tab === 'liquid'} on:click={liquid}>Liquid</div>
        <div class:hover={tab === 'bitcoin'} on:click={bitcoin}>Bitcoin</div>
        <div class:hover={tab === 'lightning'} on:click={lightning}>
          Lightning
        </div>
      </div>
    {/if}
    {#if tab !== 'liquid'}
      <p class="text-sm my-4">
        We'll automatically convert up to 1 BTC to L-BTC so you can continue
        your offer. This will incur an additional fee of
        {fee}
        sats.
      </p>
    {/if}
    <div class="mb-2 flex justify-center flex-col">
      <div class="flex mb-2 mx-auto w-4/5" class:invisible={loading}>
        {@html img}
      </div>
      {#if loading}
        <ProgressLinear />
      {:else}
        <div class="flex">
          <div
            class="break-all text-sm"
            class:truncate={!showInvoice && tab === 'lightning'}
            class:invisible={loading}
            class:mx-auto={tab !== 'lightning'}>
            {address}
          </div>
          {#if tab === 'lightning' && !showInvoice}
            <div
              class="w-1/4 ml-auto text-right whitespace-nowrap text-sm secondary-color cursor-pointer"
              on:click={toggle}>
              <div class="flex">
                <div>Show invoice</div>
                <div class="my-auto ml-1">
                  <Fa icon={faChevronDown} />
                </div>
              </div>
            </div>
          {/if}
        </div>
        {#if tab === 'lightning' && showInvoice}
          <div
            class="w-1/4 ml-auto text-right whitespace-nowrap text-sm secondary-color cursor-pointer"
            on:click={toggle}>
            <div class="flex">
              <div>Hide invoice</div>
              <div class="my-auto ml-1">
                <Fa icon={faChevronUp} />
              </div>
            </div>
          </div>
        {/if}
        <div class="flex justify-center">
          {#if tab === 'liquid'}
            <button
 class="justify-center flex center font-medium secondary-color uppercase mt-4 mr-4"
              on:click={toggleConfidential}
              >
              <div class="my-auto mr-1">
              <Fa icon={faUserSecret} />
            </div>
              <div>{ confidential ? 'Unconfidential' : 'Confidential' }</div>
            </button>
          {/if}
        <button
          on:click={() => copy(address)}
          class="justify-center flex center font-medium secondary-color uppercase mt-4">
          <div>Copy {tab === 'lightning' ? 'invoice' : 'address'}</div>
          <div class="my-auto ml-2">
            <Fa icon={faClone} />
          </div>
        </button>
      </div>
      {/if}
    </div>
  {/if}
</div>
