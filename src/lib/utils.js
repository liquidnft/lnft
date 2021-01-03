import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { prompt, password, token } from "$lib/store";
import { goto as go } from "$app/navigation";
import { PasswordPrompt } from "$comp";

export const requireLogin = async () => {
  await tick();
  return new Promise((resolve, reject) => {
    token.subscribe(($token) => {
      if (!$token || decode($token).exp * 1000 < Date.now()) {
        go("/login");
        reject();
      }

      resolve(true);
    });
  });
};

export const requirePassword = async () => {
  await requireLogin();
  return new Promise((resolve, reject) => {
    password.subscribe(async ($password) => {
      if ($password) resolve(true);
      else prompt.set(PasswordPrompt);
    });
  });
};

export const goto = (path) => {
  go(path);
  if (window) window.history.pushState(null, null, path);
};
