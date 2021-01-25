<script>
  import Summary from "./_summary";
  import Setup from "./_setup";
  import { user } from "$lib/store";
</script>

{#if $user && $user.wallet}
  <Summary />
{:else}
  <Setup />
{/if}
