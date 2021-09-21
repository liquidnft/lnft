<script>
    import Fa from 'svelte-fa';
    import {faUser, faCopy} from '@fortawesome/free-solid-svg-icons';
    import { hasura } from "$lib/api";
    import { getArtworksByOwner } from "$queries/artworks";
    import { asset, balances, user, token } from "$lib/store";
    import { assetLabel, btc, val, copy } from "$lib/utils";
    import { getBalances } from "$lib/wallet";
    import { requireLogin } from "$lib/auth";
    import { page } from "$app/stores";

    export let visible;

    $: requireLogin($page);

    if (!$asset) $asset = btc;

    let balance, loading;
    balances.subscribe((b) => b && (balance = val($asset, b[$asset] || 0)));

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

</script>

<style lang="scss">
    @import "../theme";
    .wallet {
        display: none;
        font-family: $font-family;
    }

    .visible {
        @apply block;
    }
</style>

<div class="wallet z-10 absolute left-1/2 bg-white shadow-md w-80 -ml-40 mt-16 rounded-xl overflow-hidden" class:visible >
    <div class="bg-black h-12 p-4 flex items-center justify-between">
        <div class="flex items-center text-white">
            <a href="/u/{$user.username}" class="flex items-center text-white" on:click>
                <Fa icon={faUser} class="mr-4"/> @{$user.username}
            </a>
        </div>
        <div class="flex items-center text-white cursor-pointer" on:click={() => copy($user.address)}>
            <div class="mr-4" on:click>
                {$user.address.substr(0,3)}...{$user.address.substr(-3)}
            </div>
            <div on:click>
                <div>
                    <Fa icon={faCopy} class="cursor-pointer"/>
                </div>
            </div>
        </div>
    </div>
    <div class="p-4 text-black">
        <div class="border border-gray-300 rounded-lg">
            <div class="text-center font-semibold text-gray-500 text-xs p-2">
                Balance
            </div>
            <div class="flex font-bold text-lg border-t">
                <div class="flex-1 text-center p-2 border-r">{balance} {assetLabel($asset)}</div>
                <div class="flex-1 text-center p-2 ">US$ 1.00</div>
            </div>
        </div>
        <div class="text-black flex items-center mt-2">
            <div class="flex-1 mr-4">
                <a href="/wallet/fund">
                    <button class="w-full text-xs border border-gray-300 text-gray-500 rounded font-semibold py-1" on:click>
                        Fund
                    </button>
                </a>
            </div>
            <div class="flex-1 ml-4">
                <a href="/wallet/withdraw">
                    <button class="w-full text-xs border border-gray-300 text-gray-500 rounded font-semibold py-1" on:click>
                        Withdraw
                    </button>
                </a>
            </div>
        </div>
    </div>
</div>
