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
