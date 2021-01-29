<script>
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import { poll, user, addresses, assets, token } from "$lib/store";
  import { api } from "$lib/api";
  import { fade } from "svelte/transition";
  import { getUser, getAddresses, updateUser } from "$queries/users";
  import { getAssets } from "$queries/artworks";
  import { setupUrql } from "$lib/urql";
  import { operationStore, subscription } from "@urql/svelte";
  import { page } from "$app/stores";

  let pageChange = (p) => clearInterval($poll);
  $: pageChange($page);

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

      subscription(operationStore(getAddresses), (a, b) => {
        $addresses = b.users;
      });

      subscription(operationStore(getAssets), (a, b) => {
        $assets = b.artworks;
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
