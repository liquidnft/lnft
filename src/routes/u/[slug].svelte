<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getUserByUsername } from "$queries/users";
  import User from "../user/[id].svelte";
  import { hasura } from "$lib/api";
  import { token } from "$lib/store";

  let user;

  $: update($page, $token);
  let update = async (slug) => {
    if (!slug) return;
    let h = $token ? hasura.auth(`Bearer ${$token}`) : hasura;

    let result = await h
      .post({
        query: getUserByUsername($page.params.slug),
      })
      .json();

    if (result.data) user = result.data.users[0];
    else console.log(result);
  };
</script>

{#if user}
  <User subject={user} />
{/if}
