import { api } from "$lib/api";
import { validateEmail } from "$lib/utils";
import { createWallet } from "$lib/wallet";
import wordlist from "$lib/wordlist";
import { generateMnemonic } from "bip39";

export const register = async (email, username, password) => {
  if (!validateEmail(email)) throw new Error("Invalid email");
  if (password.length < 8) throw new Error("Password must be 8 characters");

  return api
    .url("/register")
    .post({
      email,
      password,
      username,
      ...createWallet(
        generateMnemonic(undefined, undefined, wordlist),
        password
      ),
    })
    .res();
};
