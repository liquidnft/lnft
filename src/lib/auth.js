import { session } from "$app/stores";
import { api } from "$lib/api";
import decode from "jwt-decode";
import { tick } from "svelte";
import { get } from "svelte/store";
import { password as pw, poll, prompt, token } from "$lib/store";
import { PasswordPrompt } from "$comp";
import { goto, err } from "$lib/utils";

export const expired = (t) => !t || decode(t).exp * 1000 < Date.now();

export const requireLogin = async (page) => {
  if (page && page.path === "/login") return;
  try {
    if (expired(get(token))) throw new Error("Login required");
  } catch (e) {
    console.log(e);
    goto("/login");
    throw e;
  }
};

export const requirePassword = async () => {
  await requireLogin();

  if (get(pw)) return;
  let unsub;
  await new Promise(
    (resolve) =>
      (unsub = pw.subscribe((password) =>
        password ? resolve() : prompt.set(PasswordPrompt)
      ))
  );
  unsub();
  await tick();
};

export const activate = (ticket) => {
  return api.url("/activate").query({ ticket }).get().res();
};

export const checkAuthFromLocalStorage = (user) => {
  const usernameFromStorage = window.sessionStorage.getItem("username");

  if (usernameFromStorage && user.username !== usernameFromStorage) {
    goto("/logout");
  }
};
