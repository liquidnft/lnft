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
    let { data } = await hasura
      .auth(`Bearer ${$token}`)
      .post({
        query: getUserByUsername($page.params.slug),
      })
      .json();

    if (data) user = data.users[0];
  };
</script>

{#if user}
  <User subject={user} />
{/if}
