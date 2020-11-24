<script>
  import { fade } from 'svelte/transition';
  export let refresh = '';
</script>

{#key refresh}
  <div in:fade>
    <slot/>
  </div>
{/key}
