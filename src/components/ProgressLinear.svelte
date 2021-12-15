<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let app = false;
  export let progress = 0;

  let initialized = false;

  onMount(() => {
    if (!app) return;

    setTimeout(() => {
      initialized = true;
    }, 200);
  });
</script>

<div
  class:fixed={app}
  class:relative={!app}
  class:z-50={app}
  class:top-0={app}
  class:left-0={app}
  class="w-full h-1 brand-color overflow-hidden"
  class:hidden={app && !initialized}
  transition:slide={{ duration: 300 }}
>
  <div
    class="bg-gray-500 h-1 absolute"
    class:inc={!progress}
    class:transition={progress}
    style={progress ? `width: ${progress}%` : ""}
  />
  <div class="bg-gray-500 h-1 absolute dec" class:hidden={progress} />
</div>

<style>
  /* kudos https://codepen.io/shalimano/pen/wBmNGJ */
  .inc {
    animation: increase 2s ease-in-out infinite;
  }
  .dec {
    animation: decrease 2s 0.9s ease-in-out infinite;
  }

  @keyframes increase {
    from {
      left: -5%;
      width: 5%;
    }
    to {
      left: 130%;
      width: 150%;
    }
  }
  @keyframes decrease {
    from {
      left: -90%;
      width: 90%;
    }
    to {
      left: 110%;
      width: 10%;
    }
  }
</style>
