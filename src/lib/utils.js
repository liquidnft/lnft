import decode from "jwt-decode";
import { onMount } from "svelte";
import { token } from "$lib/store";
import { goto }  from "$app/navigation";

export const requireLogin = () =>
  onMount(() => {
    token.subscribe(($token) => {
      if (!$token) $token = window.sessionStorage.getItem("token");
      if (!$token || decode($token).exp * 1000 < Date.now()) goto("/login");
    });
  });
