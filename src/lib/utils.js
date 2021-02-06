import { get } from "svelte/store";
import { assets, addresses, snack } from "$lib/store";
import { goto as go } from "$app/navigation";
import { tick } from "svelte";

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

const addressLabel = (address) => {
  let $addresses = get(addresses);

  let r;

  if ($addresses) {
    r = $addresses.find((u) => u.multisig === address);
    if (r) return r.username + " 2of2";
    r = $addresses.find((u) => u.address === address);
    if (r) return r.username;
  }

  return address;
};

const assetLabel = (asset) => {
  let $assets = get(assets);

  let r = $assets && $assets.find((u) => u.asset === asset);

  return r ? r.title : ticker(asset);
};

const tickers = {
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

const ticker = (asset) => {
  return asset
    ? tickers[asset]
      ? tickers[asset].ticker
      : asset.substr(0, 4)
    : "";
};

const units = (asset) => {
  let decimals = 0;
  let precision = 0;
  if (tickers[asset]) ({ decimals, precision } = tickers[asset]);
  return [
    (val) => Math.round(val * 10 ** precision),
    (sats) => (sats / 10 ** precision).toFixed(decimals),
    ticker(asset),
  ];
};

const sats = (asset, val) => units(asset)[0](val);
const val = (asset, sats) => units(asset)[1](sats);

const goto = (path) => {
  go(path);
  if (window) window.history.pushState(null, null, path);
};

const explorer =
  import.meta && import.meta.env && import.meta.env !== "production"
    ? import.meta.env.SNOWPACK_PUBLIC_EXPLORER
    : "https://explorer.coinos.io";

const copy = (v) => {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.value = v;

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);

  info("Copied!");
};

const pick = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

const sanitize = (input) => input.replace(/[^\w.]+/g, "_");

const err = (e) => {
  let msg = e.message;
  try {
    msg = JSON.parse(msg).message;
  } catch {}
  if (!msg) msg = "An error occurred";
  snack.set({ msg, type: "error" });
};

const info = (msg) => {
  snack.set({ msg, type: "info" });
};

export {
  addressLabel,
  assetLabel,
  btc,
  cad,
  copy,
  err,
  explorer,
  goto,
  info,
  pick,
  sanitize,
  sats,
  ticker,
  tickers,
  units,
  usd,
  val,
};
