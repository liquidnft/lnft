<script>
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import {
    addresses,
    artworks,
    error,
    poll,
    prompt,
    results,
    token,
    user,
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { getUser, getAddresses, updateUser } from "$queries/users";
  import { getArtworks } from "$queries/artworks";
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
    $prompt = InsufficientFunds;

  let lastPage;
  let pageChange = (p) => {
    if (lastPage === '/market') $results = [];
    $poll.map((p) => clearInterval(p.interval))
    lastPage = p.path;
  }

  $: pageChange($page);

  let id;
  setupUrql();
  $: tokenUpdated($token);

  let tokenUpdated = async (t) => {
    if (t) {
      id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      setupUrql(t);
      subscription(operationStore(getUser(id)), (_, data) => {
        window.sessionStorage.setItem("user", JSON.stringify($user));
        $user = data.users_by_pk;
      });

      subscription(operationStore(getAddresses), (a, b) => {
        $addresses = b.users;
      });

      subscription(operationStore(getArtworks), (a, b) => {
        $artworks = b.artworks;
      });
    }
  };
</script>

<div in:fade>
  <slot />
</div>
