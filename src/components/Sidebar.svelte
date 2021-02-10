<script>
  import Menu from "./Menu.svelte";

  export let open = false;
</script>

<style>
  aside {
    left: -100%;
    transition: left 0.3s ease-in-out;
    z-index: 10;
  }

  .open {
    left: 0;
  }

  @media only screen and (min-width: 640px) {
    aside {
      display: none;
    }
  }
</style>

<aside
  class="absolute w-2/3 h-full bg-gray-200 border-r-2 shadow-lg sideBar"
  class:open>
  <Menu bind:open />
</aside>
