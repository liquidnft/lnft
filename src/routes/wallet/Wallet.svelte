<script>
  import Fa from "svelte-fa";
  import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
  import Button from "$styleguide/components/Button";

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

<style lang="scss">
    @import "../../styleguide/theme";

    .active {
        @apply border-t-2 border-b-2 border-r-2 text-white;
    }

    .bg-custom-orange {
        background: $color-orange-80;
    }
</style>

{#if loading}
    <div class="absolute top-0 w-full left-0">
        <ProgressLinear app={true} />
    </div>
{:else if $balances && $pending}
    <div class="w-full">
        <div class="bg-blue mb-2 pt-1 sm:rounded-lg">
            <div
                class="flex inline-block text-center text-white text-xl mt-5 font-bold pr-8">
                <a href="/wallet/asset">
                    <div class="items-center flex border-l-8 rounded-r-full border-orange bg-custom-orange p-3 whitespace-nowrap ">
                        <div class="whitespace-pre-wrap">
                            {name($asset)}
                        </div>
                        <div class="ml-4">
                            <Fa icon={faChevronDown}/>
                        </div>
                    </div>
                </a>
            </div>

            <div class="m-6">
                <div class="text-sm text-white">Balance</div>
                <div class="flex mt-3">
                    <span class="text-4xl text-white mr-3 font-semibold">{balance}</span>
                    <span class="text-gray-300 mt-3.5">{assetLabel($asset)}</span>
                </div>
            </div>
            <div class="m-6">
                <div class="text-sm text-white">Pending</div>
                <div class="flex mt-3">
          <span
              class="text-white mr-3">{$pending && val($asset, $pending[$asset] || 0)}</span>
                    <span class="text-gray-300">{assetLabel($asset)}</span>
                </div>
            </div>
            <div class="flex justify-between p-6 pt-2">
                <Button
                    ghostWhite
                    on:click={toggleFunding}
                    class="w-full mr-2">Fund</Button>
                <Button
                    ghostWhite
                    on:click={toggleWithdrawing}
                    class="w-full ml-2"
                    disabled={!balance}>Withdraw</Button>
            </div>
        </div>
        <div bind:this={actionsBlock}>
            <Fund bind:funding />
            <Withdraw bind:withdrawing />
            <Transactions />
        </div>
    </div>
{/if}
