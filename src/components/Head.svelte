<script>
  import { art } from "$lib/store";
</script>

<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@raretoshi" />
  <meta name="twitter:creator" content="@raretoshi" />

  {#if $art}
    <meta property="og:title" content={`Raretoshi - ${$art.title}`} />
    <meta property="og:image" content={`/api/ipfs/${$art.filename}`} />
    <meta property="og:url" content={`https://raretoshi.com/a/${$art.slug}`} />
    <meta name="twitter:title" content={`Raretoshi - ${$art.title}`} />
    <meta name="twitter:image" content={`/api/ipfs/${$art.filename}`} />
  {:else}
    <meta property="og:title" content="Raretoshi" />
    <meta property="og:image" content="https://raretoshi.com/splash.png" />
    <meta property="og:url" content="https://raretoshi.com/" />
    <meta name="twitter:title" content="Raretoshi" />
    <meta name="twitter:image" content="https://raretoshi.com/splash.png" />
  {/if}

<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&display=swap" rel="stylesheet">
</svelte:head>

