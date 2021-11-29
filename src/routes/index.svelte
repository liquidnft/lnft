<script context="module">
  export async function load({ fetch, page }) {
    const props = await fetch(`/artworks/recent.json`).then((r) => r.json());

    return {
      maxage: 90,
      props,
    };
  }
</script>

<script>
  import { onDestroy } from "svelte";
  import { query } from "$lib/api";
  import { Summary } from "$comp";
  import { fade } from "svelte/transition";
  import { user } from "$lib/store";
  import { Activity, RecentActivityCard, LatestPiecesCard } from "$comp";
  import { err } from "$lib/utils";
  import branding from "$lib/branding";

  export let featured;
  export let recent;
  export let latest;

  let interval = setInterval(() => {
    if (!featured) return;
    current++;
    if (current >= featured.length) current = 0;
  }, 6000);

  onDestroy(() => clearInterval(interval));

  let current = 0;
</script>

<div class="flex header-container mx-auto justify-center marg-bottom">
  <div class="header text-center">
    <h1 class="text-left md:text-center md:w-full">{branding.projectName}</h1>
    <h5 class="md:max-w-lg mx-auto text-left md:text-center">
      {branding.meta.homeHeroText}
    </h5>
    <h4 class="md:max-w-lg mx-auto text-left md:text-center text-green-500">
      This site is currently in Beta
    </h4>
    <h4 class="md:max-w-lg mx-auto text-left md:text-center mb-8">
      Join our
      <a class="text-blue-400" href="https://t.me/mintalio">Telegram Group</a>
      for updates and support
    </h4>
    <div class="grid grid-cols-2 gap-4 mx-auto max-w-lg">
      <div>
        <a class="primary-btn" href={`/market`}>Discover</a>
      </div>
      <div>
        <a class="secondary-btn" href={`/artwork/create`}>Create</a>
      </div>
    </div>
  </div>
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
  <a class="secondary-btn" href={"/activity"}>View more</a>
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
  <a class="secondary-btn" href={"/market"}>View gallery</a>
</div>

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

    .container.more {
      margin-top: 48px;
    }

    .marg-bottom {
      margin-bottom: 96px !important;
    }
  }
</style>
