<script>
  import { Summary } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { getCollectors } from "$queries/users";
  import Activity from "$components/Activity";
  import RecentActivityCard from "$components/RecentActivityCard";
  import LatestPiecesCard from "$components/LatestPiecesCard";
  import { goto } from "$lib/utils";
  import { getTransactions } from "$queries/transactions";

  let collectors = [];
  let getCollectors$ = operationStore(getCollectors);
  subscription(getCollectors$, (a, b) => (collectors = b.collectors));

  $: items = collectors
    .map((u) => ({ user: u, value: u.num_artworks }))
    .splice(0, 3);

  let featuredArtworkId = "40585b78-ec02-401f-8ef3-1474d2aaf783";
  let recent = [];
  let latest = [];
  subscription(operationStore(getTransactions), (a, b) => {
    recent = b.transactions.slice(0, 3);
    latest = b.transactions.filter((t) => t.type === "creation").slice(0, 3);
  });
</script>

<style>
  .header {
    width: 90%;
  }
  .secondary-header {
    height: 600px;
    background-image: url("/secondary-header.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .header-button {
    width: 170px;
    border: 1px solid white;
    color: white;
    border-radius: 30px;
    padding: 0.7rem 1.5rem !important;
  }

  @media only screen and (max-width: 500px) {
    .secondary-header {
      height: 400px;
    }
  }
</style>

<div class="flex mx-auto justify-center">
  <div class="header mt-10 md:mt-20 text-center">
    <h1 class="mb-10 text-left md:text-center w-2/3 md:w-full">
      The Raretoshi
      <br />digital art gallery
    </h1>
    <p class="md:max-w-md mx-auto text-left md:text-center">
      Upload, collect, and transact rare digital artworks as secure assets in
      the Liquid Network
    </p>
    <button class="mt-10 primary-btn" on:click={() => goto('/market')}>Start
      collecting</button>
  </div>
</div>

<div class="flex secondary-header mt-20 mb-20 text-white">
  <div
    class="container flex mx-auto flex-col justify-end md:justify-center secondary-header-text m-10 pl-6">
    <h2 class="mb-3 text-white">Anon artist</h2>
    <p>The artwork</p>
    <button
      class="button-transparent header-button text-white border mt-10"
      on:click={() => goto(`/artwork/${featuredArtworkId}`)}>
      View Artwork</button>
  </div>
</div>

<div class="container mx-auto px-10 mb-8">
  <h3>Recent Activity</h3>
</div>
<div class="container mx-auto flex overflow-x-auto">
  {#each recent as transaction}
    <RecentActivityCard {transaction} />
  {/each}
</div>
<div class="mx-auto container text-center px-8 mb-20 pb-10">
  <button class="secondary-btn" on:click={() => goto('/activity')}>View more</button>
</div>

<div class="container mx-auto px-10 mb-8">
  <h3>Latest Pieces</h3>
</div>
<div class="container mx-auto flex pb-10 overflow-x-auto">
  {#each latest as transaction}
    <LatestPiecesCard {transaction} />
  {/each}
</div>
<div class="mx-auto container text-center mb-20">
  <button class="secondary-btn" on:click={() => goto('/market')}>View gallery</button>
</div>

<div class="container mx-auto px-10 mb-10">
  <h3>Watch the market move</h3>
</div>
<div class="container mx-auto flex flex-wrap mb-20">
  <Summary
    title="Top Collectors"
    stat="Recently Collected"
    {items}
    link="/top-collectors" />
  <Summary
    title="Top Artists"
    stat="Recent Sales"
    {items}
    link="/top-artists" />
</div>
