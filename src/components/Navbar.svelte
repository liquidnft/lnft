<script>
	import Hamburger from './Hamburger.svelte'
	//import { Menu } from "$comp";
	import Menu from './Menu.svelte'

	export let sidebar = false
</script>

<style>
  .hambuger{
	  display: none;
  }

  header{
	  justify-content: flex-end;
  }

  @media only screen and (max-width: 640px){
	.hambuger{
	  display: block;
  	}
	
	nav{
		z-index: 100;
	}
  }
</style>

<header class="flex container mx-auto justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2">
	<nav class="flex hambuger">
		<Hamburger bind:open={sidebar}/>
	</nav>
	<nav class="hidden text-bold sm:block">
		<Menu />
	</nav>
</header>