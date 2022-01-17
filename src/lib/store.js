import { writable } from "svelte/store";

export const addresses = writable();
export const art = writable();
export const artworks = writable([]);
export const asset = writable();
export const assets = writable([]);
export const balances = writable({});
export const edition = writable();
export const error = writable();
export const fee = writable(100);
export const filterCriteria = writable({
  listPrice: false,
  openBid: false,
  ownedByCreator: false,
  hasSold: false,
});
export const full = writable();
export const loading = writable();
export const loaded = writable({});
export const locked = writable();
export const loggedIn = writable();
export const meta = writable();
export const offset = writable(0);
export const password = writable();
export const pending = writable();
export const poll = writable([]);
export const prompt = writable();
export const psbt = writable();
export const results = writable([]);
export const role = writable("user");
export const show = writable();
export const sighash = writable();
export const snack = writable();
export const sortCriteria = writable("newest");
export const titles = writable([]);
export const token = writable();
export const transactions = writable([]);
export const user = writable();
export const wallet = writable();
export const signStatus = writable();
