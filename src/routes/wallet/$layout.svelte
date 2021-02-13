<script>
  import Nav from "./_nav";
</script>

<style>
  :global(.dark) {
    @apply bg-black text-white p-4;
  }

  :global(.dark input, .dark select) {
    @apply bg-black text-white border;
    border-color: #3ba5ac;
  }
</style>

<div class="container mx-auto flex flex-wrap justify-between py-20">
  <Nav />
  <div class="xl:ml-10 flex-grow">
    <div class="w-full xl:w-1/2">
      <slot />
    </div>
  </div>
</div>
