<script>
  export let artwork;
  export let showDetails;
</script>

{#if artwork.filetype && artwork.filetype.includes('video')}
  <video
    controls
    class="w-full object-contain {showDetails ? 'rounded-t-lg' : 'rounded-lg'}"
    autoplay
    muted
    loop>
    <source src={`/api/ipfs/${artwork.filename}`} />
    Your browser does not support HTML5 video.
  </video>
{:else}
  <img
    src={`/api/ipfs/${artwork.filename}`}
    alt={artwork.filename}
    class="w-full object-contain rounded-t-lg {showDetails ? 'rounded-t-lg' : 'rounded-lg'}" />
{/if}
