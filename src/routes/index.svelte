<script>
  import { onMount } from "svelte";
  import { query } from "$lib/api";
  import { Summary } from "$comp";
  import { fade } from "svelte/transition";
  import { user } from "$lib/store";
  import { topCollectors, topArtists } from "$queries/users";
  import { getFeatured } from "$queries/artworks";
  import { Activity, RecentActivityCard, LatestPiecesCard } from "$comp";
  import { err, goto } from "$lib/utils";
  import { getRecentActivity, getLatestPieces } from "$queries/transactions";

  let featured = [];
  let recent = [];
  let latest = [];

  onMount(() => {
    query(getFeatured)
      .then((res) => (featured = res.featured))
      .catch(err);

    query(getRecentActivity(3))
      .then((res) => (recent = res.recentactivity))
      .catch(err);

    query(getLatestPieces(3))
      .then((res) => (latest = res.transactions))
      .catch(err);
  });

  setInterval(() => {
    current++;
    if (current >= featured.length) current = 0;
  }, 6000);

  let current = 0;

</script>

<style>
  .header {
    width: 90%;
    margin-top: 128px;
  }

  .secondary-header {
    height: 600px !important;
    width: 100%;
    object-fit: cover;
  }

  .container.more {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-top: 36px;
  }

  .more .secondary-btn {
    width: 180px;
  }

  h3 {
    margin-bottom: 36px;
  }

  @media only screen and (max-width: 768px) {
    .header {
      margin-top: 64px;
    }

    h3 {
      margin-bottom: 32px;
    }

    .secondary-header {
      height: 400px !important;
    }

    .container.more {
      margin-top: 48px;
    }
  }

</style>

<div class="flex mx-auto justify-center">
  <div class="header mt-10 md:mt-20 text-center">
    <h1 class="mb-10 text-left md:text-center w-2/3 md:w-full">
      Forever Whale
    </h1>
    <p class="md:max-w-md mx-auto text-left md:text-center">
      Artist Collab - Paul Milinski - Olivia Steele - Anchorball - Vincent Ubags
      - Tommy - Ronin
    </p>
    <div class="mt-10">
      <a
        href={`/market`}
        class="edgtf-btn edgtf-btn-solid"
        data-text="Start exploring">
        <span class="edgtf-btn-text">Start exploring</span>
      </a>
    </div>
  </div>
</div>

<div class="flex secondary-header mt-20 mb-20 text-white">
  <video
    class="lazy cover absolute secondary-header"
    autoplay
    muted
    playsinline
    loop>
    <source src="/api/ipfs/QmY3358vMspxuHy8DNDShpGummjQ7SZ5LDe9DzizEAib9t" />
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
