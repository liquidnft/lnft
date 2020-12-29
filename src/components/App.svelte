<script>
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import { user, token } from "$lib/store";
  import { getUser } from "$queries/users";
  import { api } from "$lib/api";
  import { fade } from "svelte/transition";
  import { update } from "$queries/users";
  import { setupUrql } from "$lib/urql";
  import { operationStore, subscription } from "@urql/svelte";

  let id;
  setupUrql();
  $: tokenUpdated($token);

  let timeout;
  let tokenUpdated = async (t) => {
    if (t) {
      id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      setupUrql(t);
      subscription(operationStore(getUser(id)), (_, data) => {
        $user = data.users_by_pk;
      });

      timeout = setTimeout(() => refreshToken(t), 600000);
    } else clearTimeout(timeout);
  };

  let refreshToken = (t) => {
    api
      .url("/auth/token/refresh")
      .auth(`Bearer ${t}`)
      .get()
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem("token", $token);
      });
  };
</script>

<div in:fade>
  <slot />
</div>
