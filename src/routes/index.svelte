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
  <div class="header mt-10 md:mt-20 text-center text-2xl">
    <h1 class="mb-10 text-center w-full">
      Discover, Collect, & Sell.
    </h1>
    <p class="md:max-w-md mx-auto text-center">
      Curated NFT Platform.
    </p>
    <p class="md:max-w-md mx-auto text-center">
      Art, Access + Utility NFTs.
    </p>
    <p class="md:max-w-md mx-auto text-center">
      Minted on Bitcoin. Low Fees.
    </p>
    <div class="mt-10 relative">
      <a class="edgtf-btn bg-black text-white px-20 py-2"
         href={artwork.length ? `/a/${artwork[0].slug}` : `/market`}
      >
        <span>Enter</span>
      </a>
<img src="/greencrypto.png" class="w-52 lg:absolute mx-auto py-10 bottom-4 xl:-bottom-8 right-16" />
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
    <source src="/bob.mp4" />
    Your browser does not support HTML5 video.
  </video>
</div>
