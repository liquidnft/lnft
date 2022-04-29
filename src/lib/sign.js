import { tick } from "svelte";
import { sighash, psbt } from "$lib/store";
import { get } from "svelte/store";
import { sign } from "$lib/wallet";
import { requirePassword } from "$lib/auth";

export default async () => {
  await requirePassword();
  psbt.set(await sign(get(sighash) || 1));
  await tick();
  return get(psbt);
};
