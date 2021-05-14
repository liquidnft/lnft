<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getUserByUsername } from "$queries/users";
  import { hasura } from "$lib/api";
  import User from "../user/[id].svelte";
  import { token } from "$lib/store";

  const requestPolicy = "cache-and-network";

  let user, unsubscribe;

  $: update($page);
  let update = async (slug) => {
    user = (
      await hasura
        .auth(`Bearer ${$token}`)
        .post({
          query: getUserByUsername($page.params.slug),
        })
        .json()
    ).data.users[0];
  };
</script>

{#if user}
  <User subject={user} />
{/if}
