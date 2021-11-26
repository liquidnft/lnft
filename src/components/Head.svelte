<script>
  import { meta as m } from "$lib/store";
  const { description, keywords, title, image, video, url, twitter } = $m;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />

  {#if image}
    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />
  {/if}

  {#if video}
    <meta property="og:video" content={video} />
    <meta name="twitter:video" content={video} />
  {/if}

  <meta property="og:url" content={url} />
  <meta name="twitter:card" content={twitter.card} />
  <meta name="twitter:site" content={twitter.site} />
  <meta name="twitter:creator" content={twitter.creator} />
</svelte:head>
