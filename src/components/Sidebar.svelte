<script>
  import Menu from "$styleguide/components/Navbar/Menu.svelte";

  export let open = false;

</script>

<style lang="scss">
  @import "../styleguide/theme";

  @include mobileSidebarAnimations;

  aside {
    transition: $mobile-sidebar--transition-time ease;
    background-color: $mobile-sidebar--overlay-color;
  }

  aside.close {
    animation: hide $mobile-sidebar--transition-time linear forwards;
  }

  aside.open {
    animation: open $mobile-sidebar--transition-time linear forwards;
  }

  .menu-container{
    transition: $mobile-sidebar--transition-time linear;
    width: 70%;
  }

  .open {
    transition: $mobile-sidebar--transition-time;
    @apply left-0;
    .menu-container {
      @apply left-0;
    }
  }

  @screen lg {
    aside {
      @apply hidden;
    }
  }

</style>

<aside
  class="-left-full top-0 z-20 fixed w-full h-full shadow-lg sideBar {open ? 'open' : 'close'}"
  on:click={() => open = false}
  class:open>
  <div class="menu-header bg-black h-14"/>
  <div class="menu-container -left-full bg-white absolute h-screen">
    <Menu bind:open />
  </div>
</aside>
