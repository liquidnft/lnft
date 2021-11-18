<script>
  import { onMount, createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import { faVolumeUp, faVolumeMute, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
  export let artwork;
  export let showDetails;
  export let loaded = false;
  export let thumb = true;
  export let {preview} = false;
  export let popup = false;
  const dispatch = createEventDispatcher();
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

  function hasAudio(v) {
    if (!v) return false;
    return (
      v.mozHasAudio ||
      Boolean(v.webkitAudioDecodedByteCount) ||
      Boolean(v.audioTracks && v.audioTracks.length)
    );
  }

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

  let over = () => vid && hasAudio(vid) && (invisible = false);
  let out = () => (invisible = true);

  let toggleSound = () => {
    muted = !muted;
    vid.muted = muted;
  };

  function cancelPreview() {
    dispatch('cancel'); // when user clicks on a trash icon and want to re-upload a new image
  }

</script>

<style>
  .contain,
  .cover {
    width: 100%;
    position: relative;
  }

  .contain img,
  .contain video {
    height: 350px;
    width: 100%;
    object-fit: cover;
  }

  img,
  video {
    max-height: 70vh;
    @apply mx-auto;
  }

  video {
    width: auto;
  }

  img.preview {
    max-height: 100%;
  }

</style>

{#if artwork.filetype && artwork.filetype.includes('video')}
  <div
    class="w-full"
    class:inline-block={!popup}
    class:cover
    class:contain
    on:mouseover={over}
    on:focus={over}
    on:mouseout={out}
    on:blur={out}>
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
        class="absolute hidden md:block bottom-2 right-2 secondary-color"
        type="button"
        class:invisible
        on:click|stopPropagation|preventDefault={toggleSound}>
        <Fa icon={muted ? faVolumeMute : faVolumeUp} size="1.5x" />
      </button>
    {/if}
  </div>
{:else}
  {#if preview}
    <div class="max-h-full">
      <img
          src={preview}
          alt={artwork.title}
          loading="lazy"
          class="preview"
          bind:this={img} />
      <div class="absolute cursor-pointer bg-white rounded-full w-8 h-8 top-2 right-2 p-2" on:click={cancelPreview}>
        <Fa icon={faTrashAlt}/>
      </div>
    </div>
  {:else}
    <div class="w-full" class:cover class:contain>
      <img
          src={path ? path : '/liquid_logo.svg'}
          alt={artwork.title}
          loading="lazy"
          bind:this={img} />
    </div>
  {/if}
{/if}
