<script>
  import { onMount } from "svelte";
  export let artwork;
  export let showDetails;

  $: cover = !showDetails;
  $: contain = showDetails;

  onMount(() => {
    var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

    if ("IntersectionObserver" in window) {
      var lazyVideoObserver = new IntersectionObserver(function (
        entries,
        observer
      ) {
        entries.forEach(function (video) {
          if (video.isIntersecting) {
            for (var source in video.target.children) {
              var videoSource = video.target.children[source];
              if (
                typeof videoSource.tagName === "string" &&
                videoSource.tagName === "SOURCE"
              ) {
                videoSource.src = videoSource.dataset.src;
              }
            }

            video.target.load();
            video.target.classList.remove("lazy");
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });

      lazyVideos.forEach(function (lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
  });
</script>

<style>
  .contain {
    @apply relative w-full;
    padding-bottom: 100%;
  } 

  .contain * {
    @apply h-full absolute object-cover rounded-t-lg;
  } 

  .cover * {
    @apply w-full object-contain rounded-t-lg
  } 
</style>

  <div class:cover class:contain>
{#if artwork.filetype && artwork.filetype.includes('video')}
  <video
    controls
    class="lazy w-full object-contain {showDetails ? 'rounded-t-lg' : 'rounded-lg'}"
    autoplay
    muted
    playsinline
    loop>
    <source data-src={`/api/ipfs/${artwork.filename}`} />
    Your browser does not support HTML5 video.
  </video>
{:else}

  <img
    src={`/api/ipfs/${artwork.filename}`}
    alt={artwork.filename}
    loading="lazy"
    class="" />
{/if}
</div>
