<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getUserByUsername } from "$queries/users";
  import { operationStore, subscription } from "@urql/svelte";
  import User from "./user/[id].svelte";

  let subject;
  $: subscription(operationStore(getUserByUsername($page.params.slug)), (_, data) => {
    subject = data.users[0];
  });
</script>

{#if subject}
  <User id={subject.id} />
{/if}
