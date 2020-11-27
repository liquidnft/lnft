<script>
  import { onMount } from "svelte";
  import { liquid } from "$lib/api";

  onMount(async () => {
    console.log(await liquid.url("/blocks").get().json());
  }) 
</script>

<div>Wallet</div>
