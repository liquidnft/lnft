<script>
  import Avatar from "$components/Avatar.svelte";
  import ArtworkMedia from "$components/ArtworkMedia.svelte";
  import Heart from "$styleguide/components/Heart.svelte";
  import countdown from "$lib/countdown";
  import { fade, goto, units, cad } from "$lib/utils";
  import Fa from 'svelte-fa';
  import { faShareAlt } from "@fortawesome/free-solid-svg-icons";

  export let artwork;
  export let columns = 3;
  export let link = true;
  export let showDetails = true;
  export let shadow = !showDetails;
  export let activityPage = false;
  export let loaded = false;
  export let thumb = true;
  export let popup = false;

  let sats, val, ticker;
  $: if (artwork) [sats, val, ticker] = units(artwork.asking_asset);

  let width = "full";
  if (columns > 1) {
    width = "1/" + columns;
  }

  let start_counter, end_counter;
  let count = () => {
    if (!artwork) return;
    start_counter = countdown(new Date(artwork.auction_start));
    end_counter = countdown(new Date(artwork.auction_end));
    setTimeout(count, 1000);
  };
  count();

  let isAuctionedItem = () => {
    return artwork && artwork.auction_start && artwork.auction_end;
  };

  function currencyConversion(amount, ticker, toString = true) {

    return '$0.00'

    const [getValue, getSats, cadTicker] = units(cad);

    // @TODO this is fake price conversion. Need to be replaced by coinos.io exchange rates api
    const price = val(amount) * 40000;

    if(toString) {
      return `${price} ${cadTicker}`;
    }

    return {
      value: price,
      ticker: cadTicker,
    }
  }
</script>

<style lang="scss">
    @import "../theme";

    .card {
        @apply shadow-md;
    }

    .price {
        font-size: $card--price--font-size;
    }

    .boxed {
        box-shadow: $card--box-shadow;
    }

    .description {
        color: $card--title--color;
        font-family: $card--title--font-family;
    }

    .username {
        color: $card--title--color;
    }

    .auction-item-background-gradient {
        background: $card--auction--static-background;
        background: $card--auction--gradient-background;
    }

    .buy-now-item-background-gradient {
        background: $card--buy-now--static-background;
        background: $card--buy-now--gradient-background;
    }

    .background-gray {
        background: $card--bottom-section--background;
    }

    .currency-arrow-font {
        font-family: $card--title--font-family;
        line-height: 1.6;
    }

    .title-font {
        font-family: $card--title--font-family;
    }
</style>

{#if artwork}
    <div class="rounded-3xl overflow-hidden boxed" in:fade>
        <div class="h-80 overflow-hidden flex justify-center items-center">
            <a href={`/a/${artwork.slug}`} class="w-full">
                <ArtworkMedia {artwork} {showDetails} {popup} bind:loaded bind:thumb />
            </a>
        </div>
        {#if showDetails}
            <div class="rounded-full overflow-hidden absolute w-24 h-24 -mt-16 ml-8 border-black border-4">
                <Avatar user={artwork.artist} simple/>
            </div>
            <div class="bg-black h-36 px-8 pt-12">
                <div class="text-xs mb-2 font-bold username">@{artwork.owner.username}</div>
                <div class="text-base font-bold title-font description">{artwork.title || 'No Name'}</div>
            </div>
            {#if isAuctionedItem() }
                <div class="auction-item-background-gradient h-20 p-4 flex justify-between">
                    <div class="flex-1 mr-2">
                        <div class="text-xs">Reserve Price</div>
                        <div class="text-sm flex justify-start font-bold">
                            <div>{val(artwork.reserve_price)} {ticker}</div>
                            <div class="ml-2 currency-arrow-font">&#62;</div>
                            <div class="ml-2">{ currencyConversion(artwork.reserve_price) }</div>
                        </div>
                    </div>
                    {#if artwork.bid[0] && artwork.bid[0].user}
                        <div class="ml-2">
                            <div class="text-xs whitespace-nowrap">Current bid by @{artwork.bid[0].user.username}</div>
                            <div class="text-sm flex justify-start font-bold">
                                <div>{val(artwork.bid[0].amount)} {ticker}</div>
                                <div class="ml-2 currency-arrow-font">&#62;</div>
                                <div class="ml-2">{ currencyConversion(artwork.bid[0].amount) }</div>
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="buy-now-item-background-gradient h-20 p-4 px-6 flex justify-between">
                    <div class="flex-1 mr-4">
                        <div class="text-xs">Buy now</div>
                        <div class="text-base flex justify-start font-bold">
                            {#if artwork.list_price}
                                <div>{val(artwork.list_price)} {ticker}</div>
                            {/if}
                            <div class="ml-2 currency-arrow-font">&#62;</div>
                            <div class="ml-2">{currencyConversion(artwork.list_price, ticker)}</div>
                        </div>
                    </div>
                </div>
            {/if}
            <div class="background-gray h-20 p-4 px-6 flex justify-between">

                <div>
                    {#if end_counter}
                        <div class="text-xs">Time left:</div>
                        <div class="font-bold text-lg">{end_counter}</div>
                    {/if}
                </div>

                <div class="flex items-center justify-center">
                    <Heart {artwork} />
                    <span on:click={() => alert('in development') }>
                        <Fa icon={faShareAlt} class="ml-4 cursor-pointer" color="#000" size="lg"/>
                    </span>
                </div>
            </div>
        {/if}
    </div>
{/if}

<!--{#if artwork}-->
<!--    <div-->
<!--        class="{showDetails ? 'card' : ''} bg-white flex flex-col justify-between h-full"-->
<!--        in:fade>-->
<!--        <a href={`/a/${artwork.slug}`}>-->
<!--            <ArtworkMedia {artwork} {showDetails} {popup} bind:loaded bind:thumb />-->
<!--        </a>-->
<!--        {#if showDetails}-->
<!--            <div class="p-4">-->
<!--                <div class="flex flex-row justify-between mb-2">-->
<!--                    <a href={`/a/${artwork.slug}`}>-->
<!--                        <div>-->
<!--                            <h1 class="text-xl">-->
<!--                                {artwork.title || 'Untitled'}-->
<!--                                {#if !(artwork.transferred_at || artwork.asking_asset)}-->
<!--                                    (unlisted)-->
<!--                                {/if}-->
<!--                            </h1>-->
<!--                            {#if artwork.editions > 1}-->
<!--                                <h2 class="text-sm text-gray-400 font-light">-->
<!--                                    Edition-->
<!--                                    {artwork.edition}-->
<!--                                    of-->
<!--                                    {artwork.editions}-->
<!--                                </h2>-->
<!--                            {/if}-->
<!--                        </div>-->
<!--                    </a>-->
<!--                    <Heart {artwork} />-->
<!--                </div>-->
<!--                <div class="flex mb-4">-->
<!--                    <div class="1/2 flex-1">-->
<!--                        <div class="price">-->
<!--                            {#if artwork.list_price}-->
<!--                                {val(artwork.list_price)}-->
<!--                            {:else}&mdash;{/if}-->
<!--                            {ticker}-->
<!--                        </div>-->
<!--                        <div class="w-1/2 text-sm font-medium">List Price</div>-->
<!--                    </div>-->
<!--                    {#if artwork.bid[0] && artwork.bid[0].user}-->
<!--                        <div class="1/2 flex-1">-->
<!--                            <div class="price">{val(artwork.bid[0].amount)} {ticker}</div>-->
<!--                            <div class="text-sm font-medium">-->
<!--                                Current bid by-->
<!--                                <a-->
<!--                                    href={`/u/${artwork.bid[0].user.username}`}>@{artwork.bid[0].user.username}</a>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    {/if}-->
<!--                </div>-->
<!--                <div class="flex">-->
<!--                    <div>-->
<!--                        <a href={`/u/${artwork.artist.username}`}>-->
<!--                            <div class="flex">-->
<!--                                <Avatar user={artwork.artist} />-->
<!--                                <div class="ml-2">-->
<!--                                    <div class="break-all">@{artwork.artist.username}</div>-->
<!--                                    <div class="text-xs text-gray-600">Artist</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </a>-->
<!--                    </div>-->

<!--                    {#if artwork.owner.id !== artwork.artist.id}-->
<!--                        <div class="ml-auto">-->
<!--                            <a href={`/u/${artwork.artist.username}`}>-->
<!--                                <div class="flex">-->
<!--                                    <Avatar user={artwork.owner} />-->
<!--                                    <div class="ml-2">-->
<!--                                        <div class="break-all">@{artwork.owner.username}</div>-->
<!--                                        <div class="text-xs text-gray-600">Owner</div>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </a>-->
<!--                        </div>-->
<!--                    {/if}-->
<!--                </div>-->
<!--            </div>-->
<!--            {#if end_counter}-->
<!--                <div class="p-3 rounded-b-lg lightblue-grad text-black">-->
<!--                    Time left:-->
<!--                    {end_counter}-->
<!--                </div>-->
<!--            {:else}-->
<!--                <div class="p-3 rounded-b-lg">&nbsp;</div>-->
<!--            {/if}-->
<!--        {/if}-->
<!--    </div>-->
<!--{/if}-->
