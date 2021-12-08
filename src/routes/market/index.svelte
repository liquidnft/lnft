<script context="module">
  export async function load({ fetch }) {
    const r = await fetch("/artworks.json?limit=5000").then((r) => r.json());

    return {
      maxage: 720,
      props: {
        count: Math.min(r.count, 5000),
        initialArtworks: r.artworks,
      },
    };
  }

</script>

<script>
  import { onMount } from "svelte";
  import { ProgressLinear } from "$comp";
  import Fa from "svelte-fa";
  import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
  import {
    artworks,
    results,
    show,
    token,
    user,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import { Gallery, Results, Search } from "$comp";
  import { requirePassword } from "$lib/auth";
  import { pub } from "$lib/api";

  export let count;
  export let initialArtworks;

  let filtered = initialArtworks;

  let offset = 0;

</script>

<style>
  @media only screen and (max-width: 1023px) {
    .search :global(input) {
      width: 90%;
      appearance: none;
      border: 0;
      border-bottom: 1px solid #6ed8e0;
    }
  }

  @media only screen and (max-width: 767px) {
    .primary-btn {
      width: 300px;
      text-align: center;
      margin: 0 auto;
      margin-bottom: 30px;
    }
  }

</style>

<Results />

<div
  class="container mx-auto flex flex-wrap flex-col-reverse md:flex-row sm:justify-between mt-10 md:mt-20">
  <h2 class="md:mb-0">Market</h2>
  {#if $user && $user.is_artist}
    <a href="/a/create" class="primary-btn">Submit a new artwork</a>
  {/if}
</div>
<div class="container mx-auto mt-10">
  <div class="flex items-center search">
    <Search />
  </div>
</div>
<div class="container mx-auto">
  <div
    class="flex flex-wrap justify-between items-center md:flex-row-reverse controls">
  </div>
  <Gallery bind:filtered bind:count />
</div>
