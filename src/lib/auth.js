import { api } from "$lib/api";
import decode from "jwt-decode";
import { tick } from "svelte";
import { get } from "svelte/store";
import { password, prompt, user, token } from "$lib/store";
import PasswordPrompt from "$components/PasswordPrompt";
import { goto } from "$lib/utils";

export const requireLogin = async (page) => {
  await tick();

  if (page && page.path === "/login") return;
  let $token = get(token);

  if (!$token || decode($token).exp * 1000 < Date.now()) {
    await refreshToken();
    await tick();
  }

  $token = get(token);

  if (!$token || decode($token).exp * 1000 < Date.now()) {
    goto("/login");
    throw new Error("Login required");
  }
};

export const requirePassword = async () => {
  await requireLogin();
  let unsub;
  await new Promise(
    (resolve) =>
      (unsub = password.subscribe(($password) =>
        $password ? resolve() : prompt.set(PasswordPrompt)
      ))
  );
  unsub();
};

export const refreshToken = async () => {
  let { jwt_token } = await api.url("/auth/token/refresh").get().json();
  token.set(jwt_token);
  window.sessionStorage.setItem("token", jwt_token);
};

export const logout = () => {
  api
    .url("/auth/logout")
    .post()
    .res(() => {
      window.sessionStorage.removeItem("password");
      window.sessionStorage.removeItem("token");
      token.set(null);
      user.set(null);
      goto("/login");
    });
};
