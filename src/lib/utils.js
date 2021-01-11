import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { get } from "svelte/store";
import { prompt, password, token } from "$lib/store";
import { goto as go } from "$app/navigation";
import PasswordPrompt from "$components/PasswordPrompt";

let cad, btc, usd;

if (import.meta) {
  btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
  cad = "1e31485c787e7432c7d09a4e38d893982cebfdafcf70ec5c82bf632363fdc90f";
  usd = "61c35eb3198e4713a28b77a56a281ad6a1ad04484385b69ab5ce1c1016aa622a";
} else {
  btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
  cad = "5f6e4fb59fe01c68e0f0321e2d5bb773b49ee170a990c0650acb5125542c3759";
  usd = "db670de953fb71ef1e55090414a619496d17abe75ffef55dcc99f7b8c902b173";
}

export { btc, cad, usd };

export const tickers = {
  [btc]: { ticker: "BTC", precision: 8, decimals: 8 },
  [cad]: { ticker: "CAD", precision: 8, decimals: 2 },
  [usd]: { ticker: "USD", precision: 8, decimals: 2 },
};
export const ticker = (asset) =>
  asset ? (tickers[asset] ? tickers[asset].ticker : asset.substr(0, 4)) : "";

export const conversions = (asset) => {
  let decimals = 8;
  let precision = 8;
  if (tickers[asset]) ({ decimals, precision } = tickers[asset]);
  console.log("d,p", asset, decimals, precision);
  return [
    (val) => Math.round(val * 10 ** precision),
    (sats) => (sats / 10 ** precision).toFixed(decimals),
    ticker(asset)
  ];
};

export const sats = (asset, val) => conversions(asset)[0](val);
export const val = (asset, sats) => {
  let fn = conversions(asset)[1];
  return fn(sats);
};

export const requireLogin = async () => {
  let $token = get(token);
  await tick();
  if (!$token || decode($token).exp * 1000 < Date.now()) {
    go("/login");
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

export const goto = (path) => {
  go(path);
  if (window) window.history.pushState(null, null, path);
};

export const explorer =
  import.meta && import.meta.env && import.meta.env !== "production"
    ? import.meta.env.SNOWPACK_PUBLIC_EXPLORER
    : "https://explorer.coinos.io";
