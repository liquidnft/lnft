import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { prompt, password, token } from "$lib/store";
import { goto } from "$app/navigation";

export const requireLogin = () =>
  onMount(async () => {
    await tick();
    token.subscribe(($token) => {
      if (!$token || decode($token).exp * 1000 < Date.now()) goto("/login");
    });
  });

export const requirePassword = () => {
  token.subscribe(($token) => {
    if (!$token || decode($token).exp * 1000 < Date.now()) goto("/login");
  });

  return new Promise((resolve) =>
    password.subscribe(($password) => {
      if ($password) resolve();
      else prompt.set(true);
    })
  );
};
