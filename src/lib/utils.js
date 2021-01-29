import decode from "jwt-decode";
import { onMount, tick } from "svelte";
import { get } from "svelte/store";
import { assets, addresses, prompt, password, snack, token } from "$lib/store";
import { goto as go } from "$app/navigation";
import PasswordPrompt from "$components/PasswordPrompt";

let cad, btc, usd;

if (import.meta) {
  if (import.meta.env === "production") {
    btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
    cad = "c3e0755bf62ebcdd51884b861f062dd159c3bc7ee667d7fe819450d1fa498e55";
    usd = "9f852208cd04ab21b07872ad5abdb08ac2aea29dacaa416f1c9a87234f449301";
  } else {
    btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
    cad = "1e31485c787e7432c7d09a4e38d893982cebfdafcf70ec5c82bf632363fdc90f";
    usd = "61c35eb3198e4713a28b77a56a281ad6a1ad04484385b69ab5ce1c1016aa622a";
    //btc = "6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d";
    //cad = "ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2";
    //usd = "8026fa969633b7b6f504f99dde71335d633b43d18314c501055fcd88b9fcb8de";
  }
} else {
  btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
  cad = "c3e0755bf62ebcdd51884b861f062dd159c3bc7ee667d7fe819450d1fa498e55";
  usd = "9f852208cd04ab21b07872ad5abdb08ac2aea29dacaa416f1c9a87234f449301";
}

export { btc, cad, usd };

export const addressLabel = (address) => {
  let $addresses = get(addresses);

  let r =
    $addresses &&
    $addresses.find((u) => u.address === address || u.multisig === address);

  return r ? r.username : address;
};

export const assetLabel = (asset) => {
  let $assets = get(assets);

  let r =
    $assets &&
    $assets.find((u) => u.asset === asset);

  return r ? r.title : ticker(asset);
};

export const tickers = {
  [btc]: {
    name: "Liquid Bitcoin",
    ticker: "L-BTC",
    precision: 8,
    decimals: 8,
    color: "orange-500",
  },
  [cad]: {
    name: "Liquid CAD",
    ticker: "L-CAD",
    precision: 8,
    decimals: 2,
    color: "red-500",
  },
  [usd]: {
    name: "Liquid USDt",
    ticker: "L-USDt",
    precision: 8,
    decimals: 2,
    color: "green-400",
  },
};

export const ticker = (asset) => {
  return asset
    ? tickers[asset]
      ? tickers[asset].ticker
      : asset.substr(0, 4)
    : "";
};

export const units = (asset) => {
  let decimals = 0;
  let precision = 0;
  if (tickers[asset]) ({ decimals, precision } = tickers[asset]);
  return [
    (val) => Math.round(val * 10 ** precision),
    (sats) => (sats / 10 ** precision).toFixed(decimals),
    ticker(asset),
  ];
};

export const sats = (asset, val) => units(asset)[0](val);
export const val = (asset, sats) => units(asset)[1](sats);

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

export const copy = (v) => {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.value = v;

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);

  snack.set("Copied!");
};

export const pick = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
