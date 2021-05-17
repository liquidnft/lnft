import { fade as svelteFade } from "svelte/transition";
import { get } from "svelte/store";
import {
  assets,
  artworks,
  error,
  full,
  prompt,
  snack,
  users,
} from "$lib/store";
import { goto as svelteGoto } from "$app/navigation";
import { tick } from "svelte";

let cad, btc, usd;

btc = "6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d";
cad = "0e99c1a6da379d1f4151fb9df90449d40d0608f6cb33a5bcbfc8c265f42bab0a";
usd = "ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2";

const fade = (n, o) => svelteFade(n, { ...o, duration: 50 });

const publicPages = [
  "login",
  "register",
  "activate",
  "forgot-password",
  "reset-password",
  "terms-and-conditions",
  "privacy-policy",
  "activate",
];

const addressUser = (a) =>
  get(users) && get(users).find((u) => u.address === a || u.multisig === a);

const addressLabel = (address) => {
  let $users = get(users);

  let r;

  if ($users) {
    r = $users.find((u) => u.multisig === address);
    if (r) return r.username + " 2of2";
    r = $users.find((u) => u.address === address);
    if (r) return r.username;
  }

  return address;
};

const assetLabel = (asset) => {
  let $artworks = get(artworks);

  let r = $artworks && $artworks.find((u) => u.asset === asset);

  return r ? r.title || r.name || "Untitled" : ticker(asset);
};

const artworkId = (asset) => {
  let $artworks = get(artworks);
  let r = $artworks && $artworks.find((u) => u.asset === asset);
  return r && r.id;
};

const tickers = {
  [btc]: {
    name: "Liquid BTC",
    ticker: "L-BTC",
    precision: 8,
    decimals: 8,
  },
  [cad]: {
    name: "Liquid CAD",
    ticker: "L-CAD",
    precision: 8,
    decimals: 2,
  },
  [usd]: {
    name: "Liquid USDt",
    ticker: "L-USDt",
    precision: 8,
    decimals: 2,
  },
};

const ticker = (asset) => {
  return asset
    ? tickers[asset]
      ? tickers[asset].ticker
      : asset.substr(0, 5)
    : "";
};

const units = (asset) => {
  let decimals = 0;
  let precision = 0;
  if (tickers[asset]) ({ decimals, precision } = tickers[asset]);
  return [
    (val) => Math.round(val * 10 ** precision),
    (sats) => format(sats, precision, decimals),
    ticker(asset),
  ];
};

const sats = (asset, val) => units(asset)[0](val);
const val = (asset, sats) => units(asset)[1](sats);

const goto = (path) => {
  svelteGoto(path);
  if (window) window.history.pushState(null, null, path);
};

const explorer =
  import.meta && import.meta.env && import.meta.env !== "production"
    ? import.meta.env.SNOWPACK_PUBLIC_EXPLORER
    : "https://blockstream.info/liquid";

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

const err = (e) => {
  if (typeof e === "string") e = { message: e };
  error.set(e);
  let msg = e.message;
  try {
    msg = JSON.parse(msg).message;
  } catch {}
  try {
    msg = JSON.parse(msg).message;
  } catch {}
  if (!msg) msg = "An error occurred";
  if (msg.includes("Insufficient")) return;
  setTimeout(() => snack.set({ msg, type: "error" }), 100);
  if (e.stack) console.log(e.stack);
};

const info = (msg) => {
  setTimeout(() => snack.set({ msg, type: "info" }), 100);
};

const fullscreen = (elem) => {
  if (get(full)) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    full.set(false);
    return;
  }

  if (elem.requestFullscreen) {
    elem.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }

  full.set(true);
};

function format(n, p, d) {
  if (!parseInt(p)) return parseInt(n).toFixed(0);
  else {
    let x = n / 10 ** p;
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = x.toFixed(9 - e);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    let r = x.toString().split(".")[1];
    if (r && r.length < 2 && d === 2) return x.toFixed(2);
    if (r > p && x.toFixed) return parseFloat(x.toFixed(p)).toString();
    return x;
  }
}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const go = ({ id, type, s }) => goto(`/${type}/${id ? id : s}`);

const kebab = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

const etag = async (o) => {
  let d = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(JSON.stringify(o))
  );

  return Array.from(new Uint8Array(d))
    .map((a) => a.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 27);
};

export {
  addressLabel,
  addressUser,
  artworkId,
  assetLabel,
  btc,
  cad,
  copy,
  etag,
  err,
  explorer,
  fade,
  fullscreen,
  goto,
  go,
  info,
  pick,
  sats,
  kebab,
  ticker,
  tickers,
  units,
  usd,
  val,
  validateEmail,
  publicPages,
};
