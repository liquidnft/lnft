import { api } from "$lib/api";
import { generateMnemonic } from "bip39";
import decode from "jwt-decode";
import { tick } from "svelte";
import { get } from "svelte/store";
import { password as pw, poll, prompt, user, token } from "$lib/store";
import PasswordPrompt from "$components/PasswordPrompt";
import { goto, err } from "$lib/utils";
import { createWallet } from "$lib/wallet";

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

export const refreshToken = async () => {
  try {
    let { jwt_token } = await api.url("/auth/token/refresh").get().json();
    token.set(jwt_token);
    window.sessionStorage.setItem("token", jwt_token);
  } catch (e) {}
};

export const logout = () => {
  get(poll).map(clearInterval);

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

let justRegistered;
export const register = async (email, username, password) => {
  try {
    await api
      .url("/register")
      .post({
        email,
        password,
        username,
        ...createWallet(generateMnemonic(256), password),
      })
      .badRequest(err)
      .res();

    justRegistered = true;
    login(email, password);
  } catch (e) {
    err(e);
  }
};

export const login = (email, password) => {
  api
    .url("/login")
    .post({
      email,
      password,
    })
    .unauthorized(err)
    .badRequest(err)
    .json(({ jwt_token: t }) => {
      token.set(t);
      window.sessionStorage.setItem("token", t);
      pw.set(password);
      prompt.set(false);
      justRegistered ? goto("/wallet/create") : goto("/market");
    });
};
