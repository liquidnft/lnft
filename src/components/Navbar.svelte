<script>
	import Hamburger from './Hamburger.svelte'
	import Menu from './Menu.svelte'

	export let sidebar = false
</script>

<style>
  .hambuger{
	  display: none;
  }

  header{
	  justify-content: flex-end;
	  padding-left: 30px;
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

<header class="flex container mx-auto justify-between p-2 items-center text-gray-600 mb-20">
	<h1 class="flex-auto my-auto text-green-400 text-3xl">
    	<a href="/"><img src="/logo-default.png" alt="logo" class="w-48 mt-3"></a>
  	</h1>
	<nav class="flex hambuger">
		<Hamburger bind:open={sidebar}/>
	</nav>
	<nav class="hidden text-bold sm:block">
		<Menu />
	</nav>
</header>
