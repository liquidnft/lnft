import decode from "jwt-decode";
import { tick } from "svelte";
import { get } from "svelte/store";
import { password, prompt, token } from "$lib/store";
import PasswordPrompt from "$components/PasswordPrompt";

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
