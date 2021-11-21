<script>
  import branding from "$lib/branding";

  const {
    meta: { general },
  } = branding;
</script>

<svelte:head>
  <meta name="twitter:card" content={general.twitter.card} />
  <meta name="twitter:site" content={general.twitter.site} />
  <meta name="twitter:creator" content={general.twitter.creator} />
  <title>{general.title}</title>
  <meta name="description" content={general.description} />
  <meta name="keywords" content={general.keywords} />

  <meta property="og:title" content={general.title} />
  <meta property="og:image" content={general.image} />
  <meta property="og:url" content={general.url} />
  <meta name="twitter:title" content={general.title} />
  <meta name="twitter:image" content={general.image} />
</svelte:head>
