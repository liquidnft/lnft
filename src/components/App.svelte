<script>
  import { api } from "$lib/api";
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
  import { getUser, getAddresses, updateUser } from "$queries/users";
  import { getArtworks } from "$queries/artworks";
  import { setupUrql } from "$lib/urql";
  import { operationStore, subscription } from "@urql/svelte";
  import { page } from "$app/stores";
  import { requireLogin, refreshToken } from "$lib/auth";
  import InsufficientFunds from "$components/InsufficientFunds";
  import { etag, publicPages } from "$lib/utils";

  onMount(async () => {
    refreshToken();
    setInterval(refreshToken, 600000);
  });

  $: if ($error && $error.message && $error.message.includes("Insufficient"))
    $prompt = InsufficientFunds;

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

  let id;

  setupUrql();
  $: setup($role, $token);

  let setup = async (r, t) => {
    if (t) {
      id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      setupUrql(t);

      subscription(operationStore(getUser(id, true)), async (_, data) => {
        await requireLogin();
        window.sessionStorage.setItem("user", JSON.stringify($user));
        $user = data.currentuser[0];
      });

      let a = window.localStorage.getItem("artworks");
      if (a !== 'undefined') a = JSON.parse(a);

      a = await api
        .url("/artworks")
        .headers({
          "If-None-Match": await etag(a),
        })
        .get()
        .error(304, () => {})
        .json();

      if (a) {
        $artworks = a;
        window.localStorage.setItem("artworks", JSON.stringify($artworks));
      } 

      a = window.localStorage.getItem("users");
      if (a !== 'undefined') a = JSON.parse(a);

      api
        .url("/users")
        .headers({
          "If-None-Match": await etag(a),
        })
        .get()
        .error(304, () => { a && ($users = a) })
        .json((a) => { 
          $users = a;
          window.localStorage.setItem("users", JSON.stringify($users));
        });
    }
  };
</script>

<div in:fade>
  <slot />
</div>
