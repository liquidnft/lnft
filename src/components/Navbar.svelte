<script>
  import Hamburger from "./Hamburger.svelte";
  import Menu from "./Menu.svelte";

  export let sidebar = false;
</script>

<style>
  .hambuger {
    display: none;
  }

  .mobileSearch {
    display: none;
  }

  @media only screen and (max-width: 640px) {
    .hambuger {
      display: block;
    }

    .mobileSearch {
      display: block;
    }

    nav {
      z-index: 100;
    }
  }
</style>

<header
  class="flex container mx-auto justify-between px-4 py-4 items-center text-gray-600">
  <nav class="flex hambuger">
    <Hamburger bind:open={sidebar} />
  </nav>
  <div>
    <a href="/">
      <img
        src="/logo-default.png"
        alt="logo"
        class="w-36 lg:w-48" /></a>
  </div>
  <a class="mobileSearch" href="/market"><i
      class="fas fa-search text-2xl" /></a>
  <nav class="hidden text-bold sm:block">
    <Menu />
  </nav>
</header>
