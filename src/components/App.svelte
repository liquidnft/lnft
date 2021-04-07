<script>
  import { api, hasura } from "$lib/api";
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import {
    artworks,
    error,
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
  import { getUser, getUsersAddresses, updateUser } from "$queries/users";
  import { getArtworks } from "$queries/artworks";
  import { setupUrql } from "$lib/urql";
  import { mutation, query, operationStore } from "@urql/svelte";
  import { page } from "$app/stores";
  import { requireLogin, refreshToken, requirePassword } from "$lib/auth";
  import InsufficientFunds from "$components/InsufficientFunds";
  import { etag, publicPages, err, info } from "$lib/utils";
  import { createWallet } from "$lib/wallet";

  onMount(async () => {
    refreshToken();
    setInterval(refreshToken, 600000);
  });

  $: if ($error && $error.message && $error.message.includes("Insufficient")) {
    $prompt = InsufficientFunds;
  }

  let lastPage;
  let pageChange = (p) => {
    if (!publicPages.includes(p.path.replace(/\?.*/, ""))) requireLogin();
    if (lastPage === "/market") $results = [];
    $poll.map((p) => clearInterval(p.interval));
    lastPage = p.path;
    $error = null;
    $snack = null;
  };

  $: pageChange($page);

  let id, initialized;

  setupUrql();
  $: setup($role, $token);

  let o = { requestPolicy: "cache-and-network" };
  let artworksQuery = operationStore(getArtworks, {}, o);
  query(artworksQuery).subscribe(({ data }) => {
    if (data) {
      $artworks = data.artworks;
    }
  });

  let usersQuery = operationStore(getUsersAddresses, {}, o);
  query(usersQuery).subscribe(({ data }) => {
    if (data) {
      $users = data.users;
    }
  });

  $: setupConfidential($user);
  let setupConfidential = async (u) => {
    if (!u || u.confidential) return;
    info(
      "Looks like your account doesn't have a confidential address, let's fix that"
    );
    await requirePassword();

    let { confidential, blindkey } = createWallet();
    updateUserQuery({ user: { confidential, blindkey }, id: u.id }).then(
      (r) => {
        if (r.error) return err(r.error.message);
        if (r.data) info("Your confidential address has been enabled");
      }
    );
  };

  let updateUserQuery, userQuery;
  $: if ($token) {
    updateUserQuery = mutation(updateUser);
    userQuery = operationStore(getUser);

    query(userQuery, {}, o).subscribe(async ({ data }) => {
      if (data && data.currentuser) {
        $user = data.currentuser[0];
      }
    });
  }

  let setup = (r, t) => {
    if (t && !initialized) {
      id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      setupUrql(t);
      initialized = true;
    }
  };
</script>

<div in:fade>
  <slot />
</div>
