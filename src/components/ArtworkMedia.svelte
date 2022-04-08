<script>
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import {
    faVolumeUp,
    faVolumeMute,
    faHeadphones,
  } from "@fortawesome/free-solid-svg-icons";
  import { loaded } from "$lib/store";

  export let artwork;
  export let showDetails;
  export let thumb = true;
  export let preview = false;
  export let popup = false;
  export let classes = "";
  export let noAudio = false;

  let img, vid, aud;
  $: path =
    artwork &&
    (thumb
      ? `/api/public/${artwork.filename}.${artwork.filetype.split("/")[1]}`
      : `/api/ipfs/${artwork.filename}`);

  $: cover = !showDetails;
  $: contain = showDetails;
  $: setLoaded(img, vid, aud);
  let setLoaded = (img, vid, aud) => {
    img &&
      (img.onload = () => {
        $loaded[artwork.id] = true;
        $loaded = $loaded;
      });

    vid &&
      (vid.onloadeddata = () => {
        $loaded[artwork.id] = true;
        $loaded = $loaded;
      });

    aud &&
      (aud.onerror = () => {
        $loaded[artwork.id] = true;
        $loaded = $loaded;
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
</script>

{#if artwork.filetype && artwork.filetype.includes("video")}
  <div
    class="w-full"
    class:inline-block={!popup}
    class:cover
    class:contain
    class:hidden={!loaded}
    on:mouseover={over}
    on:focus={over}
    on:mouseout={out}
    on:blur={out}
  >
    <video
      class={`lazy ${classes}`}
      autoplay
      muted
      playsinline
      loop
      bind:this={vid}
      controls={popup}
    >
      <source data-src={preview || path} />
      Your browser does not support HTML5 video.
    </video>
    {#if !popup}
      <button
        class="absolute hidden md:block bottom-2 right-2 secondary-color"
        type="button"
        class:invisible
        on:click|stopPropagation|preventDefault={toggleSound}
      >
        <Fa icon={muted ? faVolumeMute : faVolumeUp} size="1.5x" />
      </button>
    {/if}
  </div>
{:else if artwork.filetype && artwork.filetype.includes("audio")}
  <div
    class="p-5 bg-primary/50 flex justify-center items-center h-full w-full mx-auto rounded-lg"
  >
    <img src class="hidden" bind:this={aud} />
    <figure>
      <Fa icon={faHeadphones} class="mx-auto" size="3x" />
      <figcaption class="text-center">NFT audio file</figcaption>

      {#if noAudio === false}
        <audio class="mx-auto" controls src={preview || path}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      {/if}
    </figure>
  </div>
{:else}
  <div class="w-full" class:cover class:contain>
    <img
      class={`${classes}`}
      src={preview || path ? path : "/liquid_logo.svg"}
      alt={artwork.title}
      bind:this={img}
    />
  </div>
{/if}

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
</style>
