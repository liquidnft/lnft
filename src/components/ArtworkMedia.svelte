<script>
  export let artwork;
  export let showDetails;
</script>

{#if artwork.filename.includes('mp4')}
  <video
    controls
    class="w-full h-full object-cover {showDetails ? 'rounded-t-lg' : 'rounded-lg'}"
    autoplay
    muted
    loop>
    <source src={`/api/storage/o/public/${artwork.filename}`} />
    Your browser does not support HTML5 video.
  </video>
{:else}
  <img
    src={`/api/storage/o/public/${artwork.filename}`}
    alt={artwork.filename}
    class="w-full h-full rounded-t-lg object-cover {showDetails ? 'rounded-t-lg' : 'rounded-lg'}" />
{/if}
