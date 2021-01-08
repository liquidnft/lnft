import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { get } from "svelte/store";
import { prompt, password, token } from "$lib/store";
import { goto as go } from "$app/navigation";
import PasswordPrompt from "$components/PasswordPrompt";

export const btc =
  "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
export const cad =
  "5f6e4fb59fe01c68e0f0321e2d5bb773b49ee170a990c0650acb5125542c3759";
export const usd =
  "db670de953fb71ef1e55090414a619496d17abe75ffef55dcc99f7b8c902b173";

export const tickers = { [btc]: "BTC", [cad]: "CAD", [usd]: "USD" };
export const ticker = (asset) =>
  asset ? (tickers[asset] || asset.substr(0, 4)) + " sats" : "";

export const requireLogin = async () => {
  let $token = get(token);
  await tick();
  if (!$token || decode($token).exp * 1000 < Date.now()) {
    go("/login");
    throw new Error("Login required");
  }
};

export const requirePassword = async () => {
  let unsub;
  await new Promise(
    (resolve) =>
      (unsub = password.subscribe(($password) =>
        $password ? resolve() : prompt.set(PasswordPrompt)
      ))
  );
  unsub();
};

export const goto = (path) => {
  go(path);
  if (window) window.history.pushState(null, null, path);
};

export const explorer =
  import.meta && import.meta.env && import.meta.env !== "production"
    ? import.meta.env.SNOWPACK_PUBLIC_EXPLORER
    : "https://explorer.coinos.io";
