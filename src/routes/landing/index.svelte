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
    margin-top: 128px;
  }

  .header h5{
    font-size: 22px;
    line-height: 36px;
    color: #2D2E32;
    margin-top: 24px;
    margin-bottom: 34px;
  }

  .secondary-header {
    height: 600px !important;
    width: 100%;
    object-fit: cover;

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
    margin-top: 36px;
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

  h3{
    margin-bottom: 36px;
  }

  .marg-bottom{
    margin-bottom: 128px !important;
  }

  @media only screen and (max-width: 768px) {
    .header-container.marg-bottom{
      margin-bottom: 96px !important;
    }

    .header{
      margin-top: 64px;
    }

    h3{
      margin-bottom: 32px;
    }

    .header h5{
      margin-top: 24px;
      margin-bottom: 24px;
    }

    .header .primary-btn{
      display: block;
      width: 100%;
    }

    .secondary-header {
      height: 400px !important;
    }

    .container.more{
      margin-top: 48px;
    }

    .marg-bottom{
      margin-bottom: 96px !important;
    }
  }
</style>

<div class="flex header-container mx-auto justify-center marg-bottom">
  <div class="header text-center">
    <h1 class="text-left md:text-center md:w-full">
      Raretoshi
      <br />digital art
    </h1>
    <h5 class="md:max-w-lg mx-auto text-left md:text-center">
      Upload, collect, and transact rare digital artworks as secure assets in
      the Liquid Network
    </h5>
      <a class="primary-btn" href={`/market`}>Start exploring</a>
  </div>
</div>

<div class="flex secondary-header text-white marg-bottom">
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


<div class="container mx-auto px-10">
  <h3>Recent Activity</h3>
</div>
<div class="container mx-auto flex overflow-x-auto">
  {#each recent as transaction}
    <RecentActivityCard {transaction} />
  {/each}
</div>
<div class="container more marg-bottom">
  <a class="secondary-btn" href={'/activity'}>View more</a>
</div>

<div class="container mx-auto px-10">
  <h3>Latest Pieces</h3>
</div>
<div class="container mx-auto flex pb-1 overflow-x-auto">
  {#each latest as transaction}
    <LatestPiecesCard {transaction} />
  {/each}
</div>
<div class="container more marg-bottom">
  <a class="secondary-btn" href={'/market'}>View gallery</a>
</div>

<div class="container mx-auto px-10">
  <h3>Watch the market move</h3>
</div>
<div class="container mx-auto flex flex-wrap marg-bottom">
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
