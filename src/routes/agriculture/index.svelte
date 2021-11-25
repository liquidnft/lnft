<script context="module">
  export async function load({ fetch }) {
    const r = await fetch("/artworks.json").then((r) => r.json());

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
  import Fa from "svelte-fa";
  import {
    artworks,
    filterCriteria,
    results,
    show,
    sortCriteria,
    edition,
    painting,
    variation,
    token,
    user,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import { Gallery, Results, ProgressLinear, Search } from "$comp";
  import { requirePassword } from "$lib/auth";
  import { pub } from "$lib/api";
  import Armando from "$components/Armando.svelte";
  import Jose from "$components/Jose.svelte";
  import Isidro from "$components/Isidro.svelte";
  import Catalina from "$components/Catalina.svelte";
  import Felipe from "$components/Felipe.svelte";
  import Carmen from "$components/Carmen.svelte";
  import Genaro from "$components/Genaro.svelte";
  import Juan from "$components/Juan.svelte";
  import Justa from "$components/Justa.svelte";
  import Felix from '$components/Felix.svelte';

  export let count;
  export let initialArtworks;

  $artworks = initialArtworks;
  let filtered = initialArtworks;

  let offset = 0;

  $: filter($artworks, $painting, $variation, $edition);
  let filter = (a, p, v, e) => {
    if (!a) return;
    filtered = $artworks.filter(({ title }) => {
      let words = title.split(" ");
      let n = parseInt(words[words.length - 1]);
      if (!n) return false;
      if (!p) return n % 100 === 0;
      if (!v) return n <= p && n > p - 100 && n % 10 === 0;
      if (!e) return n <= v && n > v - 10;
    });
  };

  onMount(async () => {
    $edition = undefined;
    $painting = undefined;
    $variation = undefined;
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
  class="container mx-auto flex flex-wrap flex-col-reverse md:flex-row sm:justify-between my-10 md:mt-20">
  <h2 class="md:mb-0">Agriculture</h2>
  {#if $user && $user.is_artist}
    <a href="/artwork/create" class="primary-btn">Submit a new asset</a>
  {/if}
</div>


<div class="container mx-auto">
  <h3 class="mb-4">Harvest Shares</h3>
  <Gallery bind:filtered bind:count />
  <h3 class="mb-4">Coffee</h3>
  <p>Coming soon</p>
</div>

<div class="break-all">
{#if $painting > 0 && $painting <= 100}
  <Jose />
{/if}
{#if $painting > 100 && $painting <= 200}
  <Isidro />
{/if}
{#if $painting > 200 && $painting <= 300}
  <Catalina />
{/if}
{#if $painting > 300 && $painting <= 400}
  <Armando />
{/if}
{#if $painting > 400 && $painting <= 500}
  <Felipe />
{/if}
{#if $painting > 500 && $painting <= 600}
  <Carmen />
{/if}
{#if $painting > 600 && $painting <= 700}
  <Genaro />
{/if}
{#if $painting > 700 && $painting <= 800}
  <Juan />
{/if}
{#if $painting > 800 && $painting <= 900}
  <Justa />
{/if}
{#if $painting > 900 && $painting <= 1000}
  <Felix />
{/if}

</div>
