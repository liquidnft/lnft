<script>
  import { Summary } from "$comp";
  import { user } from "$lib/store";
  import { operationStore, query } from "@urql/svelte";
  import { topCollectors, topArtists } from "$queries/users";
  import Activity from "$components/Activity";
  import RecentActivityCard from "$components/RecentActivityCard";
  import LatestPiecesCard from "$components/LatestPiecesCard";
  import { goto } from "$lib/utils";
  import { getRecentActivity, getLatestPieces } from "$queries/transactions";

  const requestPolicy = "cache-and-network";
  let featuredArtworkId = "shadow-self-7897c";

  let artists = [];
  query(operationStore(topArtists(3), {}, { requestPolicy })).subscribe(
    ({ data }) =>
      data && (artists = data.artists.map((u) => ({ user: u, value: u.sold })))
  );

  let collectors = [];
  query(operationStore(topCollectors(3), {}, { requestPolicy })).subscribe(
    ({ data }) =>
      data &&
      (collectors = data.collectors.map((u) => ({ user: u, value: u.owned })))
  );

  let recent = [];
  query(operationStore(getRecentActivity(3), {}, { requestPolicy })).subscribe(
    ({ data }) => data && (recent = data.recentactivity)
  );

  let latest = [];
  query(operationStore(getLatestPieces(3), {}, { requestPolicy })).subscribe(
    ({ data }) => data && (latest = data.transactions)
  );
</script>

<style>
  .header {
    width: 90%;
  }
  .secondary-header {
    height: 600px !important;
    /*
    background-image: url("/secondary-header.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
     */
  }

  .container.more{
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: 100px;
  }

  .more .secondary-btn {
    width: 180px;
  }

  .header-button {
    width: 200px;
    border: 1px solid white;
    color: white;
    border-radius: 30px;
    padding: 0.7rem 1.5rem !important;
  }

  @media only screen and (max-width: 500px) {
    .secondary-header {
      height: 400px !important;
    }
  }
</style>

<div class="flex mx-auto justify-center">
  <div class="header mt-10 md:mt-20 text-center">
    <h1 class="mb-10 text-left md:text-center w-2/3 md:w-full">
      Raretoshi
      <br />digital art
    </h1>
    <p class="md:max-w-md mx-auto text-left md:text-center">
      Upload, collect, and transact rare digital artworks as secure assets in
      the Liquid Network
    </p>
    <div class="mt-10">
      <a class="primary-btn" href={`/market`}>Start exploring</a>
    </div>
  </div>
</div>

<div class="flex secondary-header mt-20 mb-20 text-white">
  <div
    class="container flex mx-auto flex-col justify-end md:justify-center secondary-header-text m-10 pl-6 z-10">
    <h2 class="mb-3 text-white">cryptograffiti <br />x loudsqueak</h2>
    <p>Strikes Twice</p>
    <button
      class="button-transparent header-button text-white border mt-10"
      on:click={() => goto(`/artwork/${featuredArtworkId}`)}>
      View Artwork</button>
  </div>


  <video
    class="lazy cover absolute secondary-header"
    autoplay
    muted
    playsinline
    loop>
    <source src="/api/ipfs/QmTLNhbh6EhA1V3q7NR91GLnqJ5VG8BPH2GGZ6DZrRxFqe" />
    Your browser does not support HTML5 video.
  </video>

</div>


<div class="container mx-auto px-10 mb-8">
  <h3>Recent Activity</h3>
</div>
<div class="container mx-auto flex overflow-x-auto">
  {#each recent as transaction}
    <RecentActivityCard {transaction} />
  {/each}
</div>
<div class="container more">
  <a class="secondary-btn" href={'/activity'}>View more</a>
</div>

<div class="container mx-auto px-10 mb-8">
  <h3>Latest Pieces</h3>
</div>
<div class="container mx-auto flex pb-10 overflow-x-auto">
  {#each latest as transaction}
    <LatestPiecesCard {transaction} />
  {/each}
</div>
<div class="container more">
  <a class="secondary-btn" href={'/market'}>View gallery</a>
</div>

<div class="container mx-auto px-10 mb-10">
  <h3>Watch the market move</h3>
</div>
<div class="container mx-auto flex flex-wrap mb-20">
  <Summary
    title="Top Collectors"
    stat="Works collected"
    items={collectors}
    link="/top-collectors" />
  <Summary
    title="Trending artworks"
    stat="Total shares"
    items={artists}
    link="/top-artists" />
</div>
