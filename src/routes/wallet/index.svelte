<script>
  import Summary from "./_summary";
  import Setup from "./_setup";
  import { user, wallet } from "$lib/store";
</script>

{#if $user && $wallet}
  <Summary />
{:else}
  <Setup />
{/if}
