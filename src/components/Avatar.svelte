<script>
  import { onMount } from "svelte";
  export let src; 
  export let size = "small";
</script>

<style>
  .small {
    @apply w-10 h-10;
  }

  .large {
    @apply w-20 h-20;
  }

  .xl {
    @apply w-56 h-56;
  } 
</style>

<div class={`${size} relative my-auto`}>
  <div
    class="group w-full h-full rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer">
    <img
      src={src || "https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png"}
      alt="lovely avatar"
      class="object-cover object-center w-full h-full visible group-hover:hidden" />
  </div>
</div>
