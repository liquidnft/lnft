<script>
  export let metadata;
</script>

<svelte:head>
  <title>{metadata.title}</title>
  <meta property="og:title" content={metadata.title} />
  <meta name="twitter:title" content={metadata.title} />

  <meta property="og:type" content="website" />
  <meta property="og:description" content={metadata.description} />
  <meta name="description" content={metadata.description} />

  <meta name="keywords" content={metadata.keywords} />

  {#if metadata.image}
    <meta property="og:image" content={metadata.image} />
    <meta name="twitter:image" content={metadata.image} />
  {/if}

  {#if metadata.video}
    <meta property="og:video" content={metadata.video} />
    <meta name="twitter:video" content={metadata.video} />
  {/if}

  <meta property="og:url" content={metadata.url} />
  <meta name="twitter:card" content={metadata.twitter.card} />
  <meta name="twitter:site" content={metadata.twitter.site} />
  <meta name="twitter:creator" content={metadata.twitter.creator} />
</svelte:head>
