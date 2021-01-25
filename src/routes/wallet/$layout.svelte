<script>
  import Nav from "./_nav";
</script>

<div class="container mx-auto flex justify-between px-8">
  <Nav />
  <div class="ml-10 flex-grow">
    <div class="w-full lg:w-1/3">
      <slot />
    </div>
  </div>
</div>
