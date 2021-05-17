<script>
  import { api, hasura } from "$lib/api";
  import { onMount, tick } from "svelte";
  import decode from "jwt-decode";
  import {
    artworks,
    error,
    loggedIn,
    poll,
    prompt,
    results,
    role,
    snack,
    token,
    user,
    users,
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { getUser, subscribeAddresses, updateUser } from "$queries/users";
  import { subscribeArtworks } from "$queries/artworks";
  import { setupUrql } from "$lib/urql";
  import { mutation, subscription, query, operationStore } from "@urql/svelte";
  import { page } from "$app/stores";
  import { requireLogin, refreshToken, requirePassword } from "$lib/auth";
  import InsufficientFunds from "$components/InsufficientFunds";
  import { etag, publicPages, err, info } from "$lib/utils";
  import { createWallet } from "$lib/wallet";
  import Session from "$components/Session";

  onMount(async () => {
    refreshToken();
    setInterval(refreshToken, 60000);
  });

  $: if ($error && $error.message && $error.message.includes("Insufficient")) {
    $prompt = InsufficientFunds;
  }

  let lastPage;
  let pageChange = (p) => {
    // if (!publicPages.includes(p.path.replace(/\?.*/, ""))) requireLogin();
    if (lastPage === "/market") $results = [];
    $poll.map((p) => clearInterval(p.interval));
    lastPage = p.path;
    $error = null;
    $snack = null;
  };

  $: pageChange($page);

  let id;

  setupUrql();
  $: setup($role, $token);

  let ao = operationStore(subscribeArtworks);
  subscription(ao, (a, b) => b && ($artworks = b.artworks));

  let uo = operationStore(subscribeAddresses);
  subscription(uo, (a, b) => b && ($users = b.users));

  let updateUserQuery = mutation(updateUser);
  let setup = async (r, t) => {
    if (t) {
      if (!$loggedIn) {
        id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
        setupUrql(t);
        $loggedIn = true;
      }
    }
  };
</script>

{#if $loggedIn}
  <Session />
{/if}

<div in:fade>
  <slot />
</div>
