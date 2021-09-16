<script>
    import Fa from 'svelte-fa';
    import {faUser, faCopy} from '@fortawesome/free-solid-svg-icons';

    export let visible;
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
            <Fa icon={faUser} class="mr-4"/> @Sj_Leon
        </div>
        <div class="flex items-center text-white">
            <div class="mr-4">
                XKZ..Nn4
            </div>
            <div>
                <Fa icon={faCopy} class="cursor-pointer"/>
            </div>
        </div>
    </div>
    <div class="p-4 text-black">
        <div class="border border-gray-300 rounded-lg">
            <div class="text-center font-semibold text-gray-500 text-xs p-2">
                Balance
            </div>
            <div class="flex font-bold text-lg border-t">
                <div class="flex-1 text-center p-2 border-r">0.35 L-BTC</div>
                <div class="flex-1 text-center p-2 ">US$ 1.00</div>
            </div>
        </div>
        <div class="text-black flex items-center mt-2">
            <div class="flex-1 mr-4">
                <a href="#">
                    <button class="w-full text-xs border border-gray-300 text-gray-500 rounded font-semibold py-1">
                        Fund
                    </button>
                </a>
            </div>
            <div class="flex-1 ml-4">
                <a href="#">
                    <button class="w-full text-xs border border-gray-300 text-gray-500 rounded font-semibold py-1">
                        Withdraw
                    </button>
                </a>
            </div>
        </div>
    </div>
</div>
