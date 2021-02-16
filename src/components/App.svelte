<script>
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import {
    error,
    poll,
    user,
    addresses,
    assets,
    prompt,
    token,
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { getUser, getAddresses, updateUser } from "$queries/users";
  import { getAssets } from "$queries/artworks";
  import { setupUrql } from "$lib/urql";
  import { operationStore, subscription } from "@urql/svelte";
  import { page } from "$app/stores";
  import { refreshToken } from "$lib/auth";
  import InsufficientFunds from "$components/InsufficientFunds";

  onMount(async () => {
    refreshToken();
    setInterval(refreshToken, 600000);
  });

  $: if ($error && $error.message && $error.message.includes("Insufficient"))
    prompt.set(InsufficientFunds);

  let pageChange = (p) => $poll.map(clearInterval);
  $: pageChange($page);

  let id;
  setupUrql();
  $: tokenUpdated($token);

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
    }
  };
</script>

<div in:fade>
  <slot />
</div>
