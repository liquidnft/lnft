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
  }
</style>

<div class="flex mx-auto justify-center">
  <div class="header text-center">
    <h1 class="text-7xl mb-10 font-bold primary-color">
      The Raretoshi
      <br />digital art gallery
    </h1>
    <p>
      Upload, collect, and transact rare digital artworks as
      <br />
      secure assets in the Liquid Network
    </p>
    <button
      class="mt-10 my-auto text-center mx-auto brand-color"
      on:click={() => goto('/market')}>Start exploring</button>
  </div>
</div>

<div class="flex secondary-header mt-20 mb-20 text-white">
  <div
    class="container flex mx-auto flex-col justify-center secondary-header-text m-10 pl-6">
    <h2 class="text-5xl font-bold mb-3">Anon artist</h2>
    <p>The artwork</p>
    <button
      class="button-transparent header-button text-white border mt-10"
      on:click={() => goto(`/artwork/${featuredArtworkId}`)}>
      View Artwork</button>
  </div>
</div>

<div class="container mx-auto pl-6 mb-8">
  <h3 class="primary-color font-bold text-3xl">Recent Activity</h3>
</div>
<div class="container mx-auto flex flex-wrap mb-20 pb-10">
  {#each recent as transaction}
    <RecentActivityCard {transaction} />
  {/each}
  <div class="mx-auto container text-center">
    <button class="button-transparent" on:click={() => goto('/activity')}>View more</button>
  </div>
</div>

<div class="container mx-auto pl-6 mb-8">
  <h3 class="primary-color font-bold text-3xl">Latest Pieces</h3>
</div>
<div class="container mx-auto flex flex-wrap mb-20 pb-10">
  {#each latest as transaction}
    <LatestPiecesCard {transaction} />
  {/each}
  <div class="mx-auto container text-center">
    <button class="button-transparent" on:click={() => goto('/market')}>View gallery</button>
  </div>
</div>

<div class="container mx-auto pl-6 mb-10">
  <h3 class="primary-color font-bold text-3xl">Watch the market move</h3>
</div>
<div class="container mx-auto flex flex-wrap">
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
  <Summary
    title="Largest Collections"
    stat="Artworks Owned"
    {items}
    link="/largest-collections" />
</div>

<div class="bg-black bg-opacity-75 mt-20">
  <div class="container footer mx-auto flex flex-wrap text-white pt-12 pb-12">
    <div class="flex flex-col text-sm w-full lg:w-1/3">
      <a href="/"><img src="/logo.png" alt="logo" class="w-48 mt-3" /></a>
      <p>@2021 Raretoshi</p>
    </div>
    <div class="w-full lg:w-1/3">
      <h4 class="font-bold mb-4">Follow US</h4>
      <ul class="list-none">
        <li class="mb-2">Twitter</li>
        <li class="mb-2">Youtube</li>
        <li class="mb-2">Instagram</li>
        <li class="mb-2">Blog</li>
      </ul>
    </div>
    <div class="w-full lg:w-1/3">
      <h4 class="font-bold mb-4">Help</h4>
      <ul class="list-none">
        <li class="mb-2">The Liquid Network</li>
        <li class="mb-2">Support</li>
        <li class="mb-2">Privacy Policy</li>
        <li class="mb-2">Terms of Service</li>
        <li class="mb-2">FAQs</li>
      </ul>
    </div>
  </div>
</div>
