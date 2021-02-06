import { tick } from "svelte";
import { prompt } from "$lib/store";
import SignaturePrompt from "$components/SignaturePrompt";

export default async () => {
  let unsub;
  prompt.set(SignaturePrompt);
  await new Promise(
    (resolve) =>
      (unsub = prompt.subscribe((value) => value === "success" && resolve()))
  );

  unsub();
  await tick();
};

