<script context="module">
  export async function load({ fetch }) {
    const r = await fetch("/artworks.json?limit=12").then((r) => r.json());

    return {
      maxage: 720,
      props: {
        count: r.count,
        initialArtworks: r.artworks,
      },
    };
  }

</script>

<script>
  import { onMount } from "svelte";
  import { ProgressLinear } from "$comp";
  import Fa from "svelte-fa";
  import {
    artworks,
    filterCriteria,
    results,
    show,
    sortCriteria,
    token,
    user,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import { Gallery, Results, Search } from "$comp";
  import { requirePassword } from "$lib/auth";
  import { pub } from "$lib/api";

  export let count;
  export let initialArtworks;

  let filtered = [];

  let offset = 0;

  $: reset($filterCriteria, $sortCriteria);
  let reset = async () => {
    if (initialArtworks && initialArtworks.length) {
      $artworks = initialArtworks;
      filtered = $artworks;
    }
  };

  onMount(async () => {
    const r = await fetch("/artworks.json").then((r) => r.json());
    $artworks = r.artworks;
  });

</script>

<style>
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
    <a href="/artwork/create" class="primary-btn">Submit a new asset</a>
  {/if}
</div>
<div class="container mx-auto">
  <Gallery artworks={filtered} bind:count />
</div>
