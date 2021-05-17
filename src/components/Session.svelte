<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { getUser } from "$queries/users";
  import { hasura } from "$lib/api";
  import { goto } from "$lib/utils";

  onMount(async () => {
    if ($token) {
      $user = (
        await hasura
          .auth(`Bearer ${$token}`)
          .post({
            query: getUser,
          })
          .json()
      ).data.currentuser[0];

      if (!$user.wallet_initialized) goto('/wallet/setup');
    }
  });
</script>
