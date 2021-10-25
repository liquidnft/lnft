<script>
  import { art } from "$lib/store";

</script>

<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@nft_glee" />
  <meta name="twitter:creator" content="@nft_glee" />

  {#if $art}
    <meta property="og:title" content={`NFT Glee - ${$art.title}`} />
    <meta property="og:image" content={`/api/ipfs/${$art.filename}`} />
    <meta property="og:url" content={`https://bid.nftglee.com/a/${$art.slug}`} />
    <meta name="twitter:title" content={`NFT Glee - ${$art.title}`} />
    <meta name="twitter:image" content={`/api/ipfs/${$art.filename}`} />
  {:else}
    <meta property="og:title" content="NFT Glee" />
    <meta property="og:image" content="https://bid.nftglee.com/nftglee.png" />
    <meta property="og:url" content="https://bid.nftglee.com/" />
    <meta name="twitter:title" content="NFT Glee" />
    <meta name="twitter:image" content="https://bid.nftglee.com/nftglee.png" />
  {/if}

<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&display=swap" rel="stylesheet">
</svelte:head>

