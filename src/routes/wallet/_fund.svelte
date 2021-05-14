<script>
  import Fa from "svelte-fa";
  import {
    faUserSecret,
    faChevronUp,
    faChevronDown,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import { faClone } from "@fortawesome/free-solid-svg-icons";
  import qrcode from "qrcode-generator-es6";
  import { asset, user, token } from "$lib/store";
  import { btc, copy, err } from "$lib/utils";
  import { api } from "$lib/api";
  import ProgressLinear from "$components/ProgressLinear";

  export let funding = false;

  let img;
  let tab = "liquid";

  let showInvoice = false;
  let toggle = () => {
    showInvoice = !showInvoice;
  };

  let confidential = false;
  let toggleConfidential = () => {
    confidential = !confidential;
    if (confidential) address = $user.confidential;
    else address = $user.address;
  };

  $: updateAddress(address);

  let updateAddress = (address) => {
    if (!address) return;
    const qr = new qrcode(0, "H");
    if (address.startsWith("bc")) address = `bitcoin:${address}`;
    qr.addData(address);
    qr.make();
    img = qr.createSvgTag({});
  };

  let fee = 0;
  let loading;
  let bitcoin = async () => {
    tab = "bitcoin";
    fee = 0;
    loading = true;
    try {
      ({ address, fee } = await api
        .url("/bitcoin")
        .auth(`Bearer ${$token}`)
        .post({
          amount: 10000,
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
          amount: 10000,
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
          amount: 10000,
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

  $: if ($user && $user.address) {
    const qr = new qrcode(0, "H");
    qr.addData($user.address);
    qr.make();
    img = qr.createSvgTag({});
  }
</script>

<style>
  .hover {
    @apply border-b-2;
    border-bottom: 3px solid #6ed8e0;
  }

  .tabs div {
    @apply mb-auto h-8 mx-2 md:mx-4 mt-6;
    &:hover {
      @apply hover;
    }
  }
</style>

{#if $user && funding}
  <div class="dark-bg mb-2 md:rounded-lg p-5">
    <div class="flex justify-between place-items-center text-gray-400">
      <p>Fund Wallet</p>
      <button
        class="text-gray-400 text-xl w-auto"
        on:click={() => (funding = false)}>
        <Fa icon={faTimes} />
      </button>
    </div>

    {#if $asset === btc}
      <div
        class="flex justify-center text-center cursor-pointer tabs flex-wrap mb-2">
        <div class:hover={tab === 'liquid'} on:click={liquid}>Liquid</div>
        <div class:hover={tab === 'bitcoin'} on:click={bitcoin}>Bitcoin</div>
        <div class:hover={tab === 'lightning'} on:click={lightning}>
          Lightning
        </div>
      </div>
    {/if}
    {#if loading}
      <ProgressLinear />
    {:else}
      <div class="mb-2 flex justify-center flex-col">
        <div class="flex mb-2">
          <div class="mx-auto w-1/2 qr mt-6 mb-3">
            {@html img}
          </div>
        </div>
        <div class="flex">
          <div
            class="break-all text-sm"
            class:truncate={tab === 'lightning' && !showInvoice}
            class:invisible={loading}
            class:mx-auto={tab !== 'lightning'}>
            {address}
          </div>
          {#if tab === 'lightning' && !showInvoice}
            <div
              class="flex w-1/4 ml-2 text-right whitespace-nowrap text-sm secondary-color cursor-pointer"
              on:click={toggle}>
              Show invoice
              <div class="my-auto ml-1">
                <Fa icon={faChevronDown} />
              </div>
            </div>
          {/if}
        </div>
        {#if tab === 'lightning' && showInvoice}
          <div
            class="flex w-1/4 mx-auto mt-2 text-right whitespace-nowrap text-sm secondary-color cursor-pointer"
            on:click={toggle}>
            Hide invoice
            <div class="my-auto ml-1">
              <Fa icon={faChevronUp} />
            </div>
          </div>
        {/if}
        <div class="flex justify-center">
          {#if tab === 'liquid'}
            <button
              class="justify-center flex center font-medium secondary-color uppercase mt-4 mr-4"
              on:click={toggleConfidential}>
              <div class="my-auto mr-1">
                <Fa icon={faUserSecret} />
              </div>
              <div>{confidential ? 'Unconfidential' : 'Confidential'}</div>
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
      </div>
    {/if}
  </div>
{/if}
