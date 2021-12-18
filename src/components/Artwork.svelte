<script>
  export let artwork;
  export let showDetails;
</script>

{#if artwork.filename.includes("mp4")}
  <video controls class="w-auto h-auto" autoplay muted loop>
    <source src={`/api/storage/o/public/${artwork.filename}`} />
    Your browser does not support HTML5 video.
  </video>
{:else}
  <img
    src={`/api/storage/o/public/${artwork.filename}`}
    alt={artwork.filename}
    class="w-auto h-auto"
  />
{/if}
