<script>
  import branding from "$lib/branding";

  const {
    meta: {
      description,
      keywords,
      title,
      image,
      url,
      twitter
    } 
  } = branding;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  <meta property="og:title" content={title} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={url} />

  <meta name="twitter:title" content={title} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:card" content={twitter.card} />
  <meta name="twitter:site" content={twitter.site} />
  <meta name="twitter:creator" content={twitter.creator} />
</svelte:head>
