<script>
  import branding from "$lib/branding";

  const {
    meta: {
      description,
      keywords,
      title,
      image,
      url,
      twitter,
      general,
      artwork
    } 
  } = branding;
</script>

<svelte:head>
  <meta name="twitter:card" content={general.twitter.card} />
  <meta name="twitter:site" content={general.twitter.site} />
  <meta
    name="twitter:creator"
    content={general.twitter.creator} />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  {#if $art}
    <meta property="og:title" content={artwork($art).title} />
    <meta property="og:image" content={artwork($art).image} />
    <meta property="og:url" content={artwork($art).url} />
    <meta
      name="twitter:title"
      content={artwork($art).twitter.title} />
    <meta
      name="twitter:image"
      content={artwork($art).twitter.image} />
  {:else}
    <meta property="og:title" content={general.title} />
    <meta property="og:image" content={general.image} />
    <meta property="og:url" content={general.url} />
    <meta name="twitter:title" content={general.twitter.title} />
    <meta name="twitter:image" content={general.image} />
    <meta name="twitter:card" content={general.twitter.card} />
    <meta name="twitter:site" content={general.twitter.site} />
    <meta name="twitter:creator" content={general.twitter.creator} />
  {/if}
</svelte:head>
