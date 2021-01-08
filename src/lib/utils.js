import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { get } from "svelte/store";
import { prompt, password, token } from "$lib/store";
import { goto as go } from "$app/navigation";
import PasswordPrompt from "$components/PasswordPrompt";

const btc = import.meta.env.SNOWPACK_PUBLIC_BTC;
const cad = import.meta.env.SNOWPACK_PUBLIC_CAD;
const usd = import.meta.env.SNOWPACK_PUBLIC_USD;

export const tickers = { [btc]: "BTC" , [cad]: "CAD",  [usd]: "USD" };

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
    : "https://la.coinos.io/explorer";
