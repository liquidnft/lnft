<script>
  import { onMount } from "svelte";
  export let artwork;
  export let showDetails;
  export let loaded = false;
  export let thumb = true;
  export let preview = false;

  let img, vid;
  $: path = artwork && (thumb ? `/api/public/${artwork.filename}.${artwork.filetype.split("/")[1]}` : `/api/ipfs/${artwork.filename}`);

  $: cover = !showDetails;
  $: contain = showDetails;
  $: setLoaded(img, vid);
  let setLoaded = (img, vid) => {
    img &&
      (img.onload = () => {
        loaded = true;
      });

    vid &&
      (vid.onloadeddata = () => {
        loaded = true;
      });
  };

  let loadVideo = () => {
    if (!vid) return;
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

      lazyVideoObserver.observe(vid);
    }
  };

  onMount(loadVideo);
  $: loadVideo(preview);
  $: reloadVideo(artwork);
  let reloadVideo = () => !preview && loadVideo();
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
    @apply w-full object-contain rounded-t-lg;
  }
</style>

{#if artwork.filetype && artwork.filetype.includes('video')}
  <video class="lazy" autoplay muted playsinline loop bind:this={vid}>
    <source data-src={preview || path} />
    Your browser does not support HTML5 video.
  </video>
{:else}
  <div class:cover class:contain>
    <img
      src={preview || path}
      alt={artwork.title}
      loading="lazy"
      bind:this={img} />
  </div>
{/if}
