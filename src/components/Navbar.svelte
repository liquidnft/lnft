<script>
  import Fa from "svelte-fa";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";
  import Hamburger from "./Hamburger.svelte";
  import Menu from "./Menu.svelte";

  export let sidebar = false;

</script>

<style>
  header {
    padding-top: 20px;
  }

  .hambuger {
    display: none;
  }

  .mobileSearch {
    display: none;
  }

  @media only screen and (max-width: 1023px) {
    header {
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .hambuger {
      display: block;
    }

    .mobileSearch {
      display: block;
      font-size: 20px;
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
    <a href="/" sveltekit:prefetch>
      <img src="/logo-default.svg" alt="logo" class="w-36 lg:w-48" /></a>
  </div>
  <a class="mobileSearch" href="/market">
    <Fa icon={faSearch} />
  </a>
  <nav class="hidden text-bold lg:block">
    <Menu />
  </nav>
</header>
