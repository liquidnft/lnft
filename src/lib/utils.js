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

export const requirePassword = async () => {
  return new Promise((resolve, reject) =>
    password.subscribe(async ($password) => {
      if ($password) resolve(true);
      else prompt.set(true);
    })
  );
};
