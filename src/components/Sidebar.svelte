<script>
  import Menu from "./Menu.svelte";

  export let open = false;
</script>

<aside
  class="fixed w-full h-full border-r-2 shadow-lg sideBar"
  on:click={() => (open = false)}
  class:open
>
  <div class="menu-container">
    <Menu bind:open />
  </div>
</aside>

<style>
  aside {
    left: -100%;
    top: 0;
    transition: left 0.3s ease-in-out;
    z-index: 20;
    background-color: white;
  }

  .menu-container {
    width: 70%;
    background-color: white;
    position: absolute;
    height: 100vh;
  }

  .open {
    left: 0;
    animation: changeColor 2s ease forwards;
  }

  @media only screen and (min-width: 1023px) {
    aside {
      display: none;
    }
  }

  @keyframes changeColor {
    0% {
      background-color: white;
    }
    100% {
      background-color: rgba(3, 3, 3, 0.8);
    }
  }
</style>
