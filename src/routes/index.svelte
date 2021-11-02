<script>
  import { onMount } from "svelte";
  import { query } from "$lib/api";
  import { Summary } from "$comp";
  import { fade } from "svelte/transition";
  import { user } from "$lib/store";
  import { topCollectors, topArtists } from "$queries/users";
  import { getFeatured, getLatestArtwork } from "$queries/artworks";
  import { Activity, RecentActivityCard, LatestPiecesCard } from "$comp";
  import { err, goto } from "$lib/utils";
  import { getRecentActivity, getLatestPieces } from "$queries/transactions";

  let featured = [];
  let recent = [];
  let latest = [];
  let artwork = [];

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

    query(getLatestArtwork)
      .then(res => (artwork = res.artworks))
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

  .header .primary-btn {
    width: 240px;
    margin: 0 auto;
  }

  .header h5 {
    font-size: 22px;
    line-height: 36px;
    color: #2d2e32;
    margin-top: 24px;
    margin-bottom: 34px;
  }

  .secondary-header {
    height: 600px !important;
    width: 100%;
    object-fit: cover;
  }

  .blur-bg {
    display: flex;
    padding: 60px;
    flex-direction: column;
    background: rgba(54, 58, 74, 0.45);
    backdrop-filter: blur(30px);
    box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 10%);
    border-radius: 8px;
    color: white;
    width: 50%;
    width: fit-content;
  }

  .blur-bg h2 {
    color: white !important;
  }

  .blur-bg p {
    color: white !important;
    margin-top: 20px;
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

  .header-button {
    width: 200px;
    border: 1px solid;
    border-radius: 30px;
    padding: 0.7rem 1.5rem !important;
  }

  h3 {
    margin-bottom: 36px;
  }

  .marg-bottom {
    margin-bottom: 128px !important;
  }

  @media only screen and (max-width: 768px) {
    .header-container.marg-bottom {
      margin-bottom: 96px !important;
    }

    .header {
      margin-top: 64px;
    }

    h3 {
      margin-bottom: 32px;
    }

    .header h5 {
      margin-top: 24px;
      margin-bottom: 24px;
    }

    .header .primary-btn {
      width: 100%;
    }

    .secondary-header {
      height: 400px !important;
    }

    .container.more {
      margin-top: 48px;
    }

    .marg-bottom {
      margin-bottom: 96px !important;
    }

    .blur-bg {
      padding: 24px;
      width: 75%;
      width: fit-content;
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
        href={artwork.length ? `/a/${artwork[0].slug}` : `/market`}
        class="edgtf-btn edgtf-btn-solid"
        data-text="Buy Now">
        <span class="edgtf-btn-text">Buy Now</span>
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
