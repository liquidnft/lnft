import { session } from "$app/stores";
import { api } from "$lib/api";
import decode from "jwt-decode";
import { tick } from "svelte";
import { get } from "svelte/store";
import {
  password as pw,
  poll,
  prompt,
  user,
  token,
} from "$lib/store";
import { PasswordPrompt } from "$comp";
import { goto, err } from "$lib/utils";

export const expired = (t) => !t || decode(t).exp * 1000 < Date.now();

export const requireLogin = async (page) => {
  await tick();

  if (page && page.path === "/login") return;
  let $token = get(token);

  if (expired($token)) {
    try {
      await refreshToken();
      await tick();
    } catch (e) {}
  }

  $token = get(token);

  if (expired($token)) {
    goto("/login");
    throw new Error("Login required");
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

export const refreshToken = () => {
  return api
    .url("/auth/token/refresh")
    .get()
    .json(({ jwt_token }) => {
      token.set(jwt_token);
      window.sessionStorage.setItem("token", jwt_token);
    });
};

export const logout = () => {
  session.set(null);

  window.sessionStorage.removeItem("password");
  window.sessionStorage.removeItem("token");

  token.set(null);
  user.set(null);
  get(poll).map((p) => clearInterval(p.interval));

  api
    .url("/auth/logout")
    .post()
    .res(() => goto("/login"));
};

export const activate = (ticket) => {
  return api.url("/activate").query({ ticket }).get().res();
};
