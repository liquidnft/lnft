<script>
  import { art } from "$lib/store";
  import branding from "$lib/branding";
</script>

<svelte:head>
  <meta name="twitter:card" content={branding.meta.general.twitter.card} />
  <meta name="twitter:site" content={branding.meta.general.twitter.site} />
  <meta name="twitter:creator" content={branding.meta.general.twitter.creator} />

  {#if $art}
    <meta property="og:title" content={branding.meta.artPage($art).og.title} />
    <meta property="og:image" content={branding.meta.artPage($art).og.image} />
    <meta property="og:url" content={branding.meta.artPage($art).og.url} />
    <meta name="twitter:title" content={branding.meta.artPage($art).twitter.title} />
    <meta name="twitter:image" content={branding.meta.artPage($art).twitter.image} />
  {:else}
    <meta property="og:title" content={branding.meta.general.og.title} />
    <meta property="og:image" content={branding.meta.general.og.image} />
    <meta property="og:url" content={branding.meta.general.og.url} />
    <meta name="twitter:title" content={branding.meta.general.twitter.title} />
    <meta name="twitter:image" content={branding.meta.general.twitter.image} />
  {/if}
</svelte:head>
