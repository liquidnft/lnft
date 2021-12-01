<script>
  import { meta as m } from "$lib/store";

</script>

<svelte:head>
  <title>{$m.title}</title>
  <meta name="description" content={$m.description} />
  <meta name="keywords" content={$m.keywords} />

  <meta property="og:title" content={$m.title} />
  <meta name="twitter:title" content={$m.title} />

  {#if $m.image}
    <meta property="og:image" content={$m.image} />
    <meta name="twitter:image" content={$m.image} />
  {/if}

  {#if $m.video}
    <meta property="og:video" content={$m.video} />
    <meta name="twitter:video" content={$m.video} />
  {/if}

  <meta property="og:url" content={$m.url} />
  <meta name="twitter:card" content={$m.twitter.card} />
  <meta name="twitter:site" content={$m.twitter.site} />
  <meta name="twitter:creator" content={$m.twitter.creator} />
</svelte:head>
