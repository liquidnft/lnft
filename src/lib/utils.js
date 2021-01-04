import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { prompt, password, token } from "$lib/store";
import { goto as go } from "$app/navigation";
import PasswordPrompt from "$components/PasswordPrompt";

export const requireLogin = async ($token) => {
  await tick();
  if (!$token || decode($token).exp * 1000 < Date.now()) {
    go("/login");
    throw new Error("Login required");
  }
};

export const requirePassword = async () => {
  let unsub;
  await new Promise((resolve) => (unsub = password.subscribe(($password) =>
    $password ? resolve() : prompt.set(PasswordPrompt)
  ))
  );
  unsub();
};

export const goto = (path) => {
  go(path);
  if (window) window.history.pushState(null, null, path);
};
