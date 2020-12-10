<script>
	//import { Menu } from "$comp";
	import Menu from './Menu.svelte'

	export let open = false
</script>

<style>
	aside {
		right: -100%;
		transition: right 0.3s ease-in-out;
		z-index: 10;
	}
	
	.open {
		right: 0
	}

	@media only screen and (min-width: 640px){
		aside{
			display: none;
		}
  	}
</style>


<aside class="absolute w-10/12 h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<Menu />
</aside>