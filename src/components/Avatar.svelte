<script>
  export let user = undefined;
  export let src = undefined;
  export let overlay = undefined;
  export let size = "small";
</script>

<div class={`${size} my-auto relative`}>
  <div
    class={`relative ${size} group rounded-full overflow-hidden shadow-inner text-center cursor-pointer`}
  >
    {#if user || src}
      <img
        key={user && user.username}
        src={user
          ? `/api/public/${user.avatar_url}`
          : src.startsWith("data")
          ? src
          : `/api/public/${src}`}
        alt={user ? user.username : "lovely avatar"}
        class="absolute w-full h-full object-cover object-center visible overflow-hidden"
      />
    {/if}
  </div>
  {#if overlay}
    <img
      alt="Multisig"
      src={overlay}
      class="w-6 h-6 absolute"
      style="bottom: -8px; right: -20px"
    />
  {/if}
</div>

<style>
  .small {
    @apply w-12 h-12;
  }

  .xs {
    @apply w-10 h-10;
  } 

  .large {
    @apply w-16 h-16;
  }

  .xl {
    @apply w-56 h-56;
  }
</style>
