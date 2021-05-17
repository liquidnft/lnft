<script>
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

  export let artwork;
  export let showDetails;
  export let loaded = false;
  export let thumb = true;
  export let preview = false;
  export let popup = false;

  let img, vid;
  $: path =
    artwork &&
    (thumb
      ? `/api/public/${artwork.filename}.${artwork.filetype.split("/")[1]}`
      : `/api/ipfs/${artwork.filename}`);

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
  let reloadVideo = () => (vid && vid.currentTime) || loadVideo();

  let muted = true;
  let invisible = true;

  let over = () => (invisible = false);
  let out = () => (invisible = true);

  let toggleSound = () => {
    muted = !muted;
    vid.muted = muted;
  };
</script>

<style>
  .contain, .cover {
    position: relative;
  } 

  .contain img, .contain video {
    height: 350px;
    width: 100%;
    object-fit: cover;
  } 

  img, video {
    @apply mx-auto;
    max-height: 70vh;
  } 
</style>

{#if artwork.filetype && artwork.filetype.includes('video')}
  <div class:cover class:contain on:mouseover={over} on:mouseout={out}>
    <video
      class="lazy"
      autoplay
      muted
      playsinline
      loop
      bind:this={vid}
      controls={popup}>
      <source data-src={preview || path} />
      Your browser does not support HTML5 video.
    </video>
    {#if !popup}
      <button
        class="absolute hidden md:block bottom-2 right-2 text-primary"
        type="button"
        class:invisible
        on:click|stopPropagation|preventDefault={toggleSound}>
        <Fa icon={muted ? faVolumeMute : faVolumeUp} size="1.5x" />
      </button>
    {/if}
  </div>
{:else}
  <div class:cover class:contain>
    <img
      src={preview || path}
      alt={artwork.title}
      loading="lazy"
      bind:this={img} />
  </div>
{/if}
