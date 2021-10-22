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
  import branding from "$lib/branding";
  import Button from "$styleguide/components/Button.svelte";

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

<style lang="scss">
  @import "../styleguide/theme.scss";

  .secondary-font {
    font-family: "Audiowide", sans-serif;
  }

</style>

<div class="min-h-screen flex header-container mx-auto justify-center items-center bg-black">

  <div class="flex justify-center mx-24 -mt-32">
    <div class="leading-normal">
      <div class="text-gray-500 text-xl font-semibold">
        WE ARE DISRUPTING THE NFT INDUSTRY.
      </div>
      <div class="text-white text-5xl secondary-font font-bold leading-normal mt-4">
        The First marketplace<br/>
        for NFT-Experiences
      </div>
      <div class="text-white text-xl secondary-font font-bold mt-4">
        From creators for everyone
      </div>
      <div class="text-gray-500 text-base font-semibold mt-6">
        An NFT marketplace with real-life experiences <br/>based on the L-BTC blockchain.
      </div>
      <div class="mt-8">
        <a href="/market">
          <Button primary>Start Exploring</Button>
        </a>
      </div>
    </div>
    <div class="flex flex-1 ml-20 sm:hidden xl:flex items-center">
      <div>
        <a href="/market">
          <img src="/cards.png" class="w-full max-h-96">
        </a>
      </div>
    </div>
  </div>

</div>
