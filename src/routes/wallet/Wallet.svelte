<script>
  import Fa from "svelte-fa";
  import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
  import { border, bg } from "./_colors";
  import { page } from "$app/stores";
  import { electrs, hasura } from "$lib/api";
  import { onMount, tick } from "svelte";
  import { asset, assets, balances, pending, password, user, token } from "$lib/store";
  import { ProgressLinear } from "$comp";
  import { getArtworksByOwner } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { assetLabel, btc, sats, tickers, val } from "$lib/utils";
  import { requireLogin } from "$lib/auth";
  import { getBalances } from "$lib/wallet";

  import Fund from "./_fund";
  import Withdraw from "./_withdraw";
  import Transactions from "./_transactions";

  $: requireLogin($page);

  let balance;
  balances.subscribe((b) => b && (balance = val($asset, b[$asset] || 0)));

  let loading = true;
  if (!$asset) $asset = btc;
  let name = (a) => {
    return tickers[a] ? tickers[a].name : assetLabel(a);
  };

  let ticker = (a) => {
    let artwork = artworks.find((aw) => aw.a === a);
    if (artwork) return artwork.title;
    return tickers[a] ? tickers[a].ticker : a.substr(0, 5);
  };

  let funding;
  let withdrawing;

  $: funding = $page && $page.params && $page.params.action && $page.params.action === 'fund';
  $: withdrawing = $page && $page.params && $page.params.action && $page.params.action === 'withdraw';

  let toggleFunding = () => {
    funding = !funding;
    withdrawing = false;
  };

  let toggleWithdrawing = () => {
    withdrawing = !withdrawing;
    funding = false;
  };

  let artworks = [];
  $: init($user);
  let init = async (u) => {
    if (!u) return;
    let { data } = await hasura
    .auth(`Bearer ${$token}`)
    .post({
      query: getArtworksByOwner($user.id),
    })
    .json();

    if (data) ({ artworks } = data);
    getBalances();
    loading = false;
  };

  let actionsBlock, y;

  function scrollTo(elem) {
    if(!elem || !($page && $page.params && $page.params.action && $page.params.action))
      return false;

    setTimeout(() => {
      // this is height of HEADER and additional space
      // to make Fund/Withdraw buttons visible
      const OFFSET = 200;
      y = elem.getBoundingClientRect().top + y - OFFSET;
    }, 100)
  }

  $: scrollTo(actionsBlock);
</script>

<svelte:window bind:scrollY={y}/>

<style>
    .dark-red {
        background: #2b0208;
    }
    .dark-green {
        background: #082527;
    }
    .dark-gray {
        background: #31373e;
    }
    .border-blue {
        border-color: #6ed8e0;
    }

    .bg-btc {
        background: rgba(52, 190, 171, 0.25);
    }
    .border-btc {
        border-color: #30bfad;
    }

    .light-color {
        color: #f4f4f4;
    }

    .active {
        @apply border-t-2 border-b-2 border-r-2 text-white;
    }

    button:disabled {
        @apply text-gray-400 border-gray-400;
    }
</style>

{#if loading}
    <div class="absolute top-0 w-full left-0">
        <ProgressLinear app={true} />
    </div>
{:else if $balances && $pending}
    <div class="w-full">
        {#if $assets.length > 1}
            <div class="mb-5">
                <a class="secondary-color" href="/wallet/asset">
                    <div class="flex">
                        <div class="px-5 md:px-0">
                            {$assets.length}
                            assets available in this wallet
                        </div>
                        <div class="my-auto ml-1">
                            <Fa icon={faChevronRight} />
                        </div>
                    </div>
                </a>
            </div>
        {/if}

        <div class="dark-bg mb-2 pt-1 sm:rounded-lg">
            <div
                class={`border-l-8 text-center p-3 text-white text-xl w-1/2 rounded-r-full mt-5 font-bold ${border($asset)} ${bg($asset)}`}>
                {name($asset)}
            </div>

            <div class="m-6">
                <div class="text-sm light-color">Balance</div>
                <div class="flex mt-3">
                    <span class="text-4xl text-white mr-3">{balance}</span>
                    <span class="text-gray-400 mt-3.5">{assetLabel($asset)}</span>
                </div>
            </div>
            <div class="m-6">
                <div class="text-sm light-color">Pending</div>
                <div class="flex mt-3">
          <span
              class="light-color mr-3">{$pending && val($asset, $pending[$asset] || 0)}</span>
                    <span class="text-gray-400">{assetLabel($asset)}</span>
                </div>
            </div>
            <div class="flex justify-between p-6 pt-2">
                <button
                    on:click={toggleFunding}
                    class="button-trans-gray w-full mr-2">Fund</button>
                <button
                    on:click={toggleWithdrawing}
                    class="button-trans-gray w-full ml-2"
                    disabled={!balance}>Withdraw</button>
            </div>
        </div>
        <div bind:this={actionsBlock}>
            <Fund bind:funding />
            <Withdraw bind:withdrawing />
            <Transactions />
        </div>
    </div>
{/if}
