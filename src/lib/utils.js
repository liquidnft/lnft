import { fade as svelteFade } from "svelte/transition";
import { get } from "svelte/store";
import { assets, artworks, addresses, error, full, prompt, snack } from "$lib/store";
import { goto as svelteGoto } from "$app/navigation";
import { tick } from "svelte";

let cad, btc, usd;

btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";
cad = "1e31485c787e7432c7d09a4e38d893982cebfdafcf70ec5c82bf632363fdc90f";
usd = "61c35eb3198e4713a28b77a56a281ad6a1ad04484385b69ab5ce1c1016aa622a";
/*
btc = "6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d";
cad = "ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2";
usd = "8026fa969633b7b6f504f99dde71335d633b43d18314c501055fcd88b9fcb8de";
*/

const fade = (n, o) => svelteFade(n, { ...o, duration: 50 })

const addressUser = (a) =>
  get(addresses) && get(addresses).find((u) => u.address === a || u.multisig === a);

const addressLabel = (address) => {
  let $addresses = get(addresses);

  let r;

  if ($addresses) {
    r = $addresses.find((u) => u.multisig === address);
    if (r) return r.username + " + us";
    r = $addresses.find((u) => u.address === address);
    if (r) return r.username;
  }

  return address;
};

const assetLabel = (asset) => {
  let $artworks = get(artworks);

  let r = $artworks && $artworks.find((u) => u.asset === asset);

  return r ? (r.title || r.name || 'Untitled') : ticker(asset);
};

const artworkId = (asset) => {
  let $artworks = get(artworks);
  let r = $artworks && $artworks.find((u) => u.asset === asset);
  return r && r.id;
};

const tickers = {
  [btc]: {
    name: "Liquid Bitcoin",
    ticker: "BTC",
    precision: 8,
    decimals: 8,
    color: "orange-500",
  },
  [cad]: {
    name: "Liquid CAD",
    ticker: "CAD",
    precision: 8,
    decimals: 2,
    color: "red-500",
  },
  [usd]: {
    name: "Liquid USDt",
    ticker: "USDt",
    precision: 8,
    decimals: 2,
    color: "green-400",
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
    (sats) => format(sats, precision),
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
  snack.set({ msg, type: "error" });
  if (e.stack) console.log(e.stack);
};

const info = (msg) => {
  snack.set({ msg, type: "info" });
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


function format(n, p) {
  if (!parseInt(p)) return parseInt(n).toFixed(0);
  else {
    let x = n / 10 ** p;
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = x.toFixed(9 - e);
        x = '0.' + new Array(e).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join('0');
      }
    }
    if (x.toString().split('.')[1] > p && x.toFixed) return parseFloat(x.toFixed(p)).toString();
    return x;
  }
}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const go = ({ id, type, s }) => goto(`/${type}/${id ? id : s}`);

export {
  addressLabel,
  addressUser,
  artworkId,
  assetLabel,
  btc,
  cad,
  copy,
  err,
  explorer,
  fade,
  fullscreen,
  goto,
  go,
  info,
  pick,
  sats,
  ticker,
  tickers,
  units,
  usd,
  val,
  validateEmail
};
