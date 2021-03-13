<script>
  export let user = undefined;
  export let src = undefined;
  export let size = "small";
</script>

<style>
  .small {
    @apply w-12 h-12;
  }

  .large {
    @apply w-20 h-20;
  }

  .xl {
    @apply w-56 h-56;
  }
</style>

<div class={`${size} my-auto`}>
  <div
    class={`relative ${size} group rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer`}>
    {#if user || src}
      <img
        key={user && user.username}
        src={user ? `/api/ipfs/${user.avatar_url}` : src.startsWith('data') ? src : `/api/ipfs/${src}`}
        alt={user ? user.username : 'lovely avatar'}
        class="absolute w-full h-full object-cover object-center visible group-hover:hidden overflow-hidden" />
    {/if}
  </div>
</div>
