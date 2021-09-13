<script>
  import { onMount } from "svelte";
  import { hasura } from "$lib/api";
  import { Summary } from "$comp";
  import { fade } from "svelte/transition";
  import { user } from "$lib/store";
  import { operationStore, query } from "@urql/svelte";
  import { topCollectors, topArtists } from "$queries/users";
  import { getFeatured } from "$queries/artworks";
  import Activity from "$components/Activity";
  import RecentActivityCard from "$components/RecentActivityCard";
  import LatestPiecesCard from "$components/LatestPiecesCard";
  import { err, goto } from "$lib/utils";
  import { getRecentActivity, getLatestPieces } from "$queries/transactions";

  let featured = [];
  let recent = [];
  let latest = [];

  onMount(async () => {
    try {
      featured = (
        await hasura
          .post({
            query: getFeatured,
          })
          .json()
      ).data.featured;

      recent = (
        await hasura
          .post({
            query: getRecentActivity(3),
          })
          .json()
      ).data.recentactivity;

      latest = (
        await hasura
          .post({
            query: getLatestPieces(3),
          })
          .json()
      ).data.transactions;
    } catch (e) {
      err(e);
    }
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

  .blur-bg{
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

  .blur-bg p{
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

    .blur-bg{
      padding: 24px;
      width: 75%;
      width: fit-content;
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
      Upload, collect, and transact rare digital art on the Liquid Network
    </h5>
    <a class="primary-btn" href={`/market`}>Start exploring</a>
  </div>
</div>

{#if featured[current]}
  <div class="flex secondary-header marg-bottom">
    <div
      class="container flex mx-auto flex-col justify-end md:justify-center secondary-header-text m-10 pl-6 z-10"
      class:text-white={featured[current].white}>
      <div class="blur-bg">
        <h2 class:text-white={featured[current].white}>
          {featured[current].artwork.artist.username}
        </h2>
        <p>
          {featured[current].artwork.title}
          {#if featured[current].white}
            <button
              class="button-transparent header-button border mt-10"
              style="border-color: white; color: white"
              on:click={() => goto(`/a/${featured[current].artwork.slug}`)}>
              View Artwork</button>
          {:else}
            <button
              class="button-transparent header-button border mt-10"
              on:click={() => goto(`/a/${featured[current].artwork.slug}`)}>
              View Artwork</button>
          {/if}
        </p>
      </div>
    </div>

    {#if featured[current].artwork.filetype.includes('video')}
      <video
        in:fade
        out:fade
        class="lazy cover absolute secondary-header"
        autoplay
        muted
        playsinline
        loop
        src={`/api/ipfs/${featured[current].artwork.filename}`}
        :key={featured[current].id} />
    {:else}
      <img
        in:fade
        out:fade
        class="lazy cover absolute secondary-header"
        src={`/api/ipfs/${featured[current].artwork.filename}`} />
    {/if}
  </div>
{/if}

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
