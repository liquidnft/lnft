import { writable } from "svelte/store";

export const fee = writable(1500);
export const error = writable();
export const addresses = writable();
export const artworks = writable([]);
export const asset = writable();
export const assets = writable([]);
export const balances = writable();
export const filterCriteria = writable({
  listPrice: false,
  openBid: false,
  ownedByCreator: false,
  hasSold: false,
});
export const full = writable();
export const pending = writable();
export const loading = writable();
export const password = writable();
export const poll = writable([]);
export const prompt = writable();
export const psbt = writable();
export const results = writable([]);
export const show = writable();
export const sighash = writable();
export const sortCriteria = writable("newest");
export const snack = writable();
export const transactions = writable([]);
export const token = writable();
export const user = writable();
export const wallet = writable();
export const role = writable("user");
export const edition = writable();
