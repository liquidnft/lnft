<svelte:options accessors={true} />

<script>
  import { session } from "$app/stores";
  import { psbt, prompt, signStatus } from "$lib/store";
  import { Transaction } from "$comp";
  import { copy, err } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import { ACCEPTED, CANCELLED } from "../lib/wallet";
  import { query } from "$lib/api";
  import { updateUser } from "$queries/users";
  import Fa from "svelte-fa";
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

  let remove_prompt_sign = false;

  const disableSignPrompts = async () => {
    await query(updateUser, {
      user: { prompt_sign: false },
      id: $session.user.id,
    });
    $session.user.prompt_sign = false;
  };

  export const submit = async (e) => {
    await requirePassword($session);

    try {
      $signStatus = ACCEPTED;

      if (remove_prompt_sign) {
        await disableSignPrompts();
      }
    } catch (e) {
      err(e);
    }

    $prompt = undefined;
  };

  export const cancel = async (e) => {
    try {
      $signStatus = CANCELLED;

      if (remove_prompt_sign) {
        await disableSignPrompts();
      }
    } catch (e) {
      err(e);
    }

    $prompt = undefined;
  };

  let base64 = false;
</script>

{#await Promise.resolve($psbt)}
  Loading...
{:then p}
  <div class="flex justify-between">
    <h1 class="font-black text-4xl primary-color">Sign transaction</h1>
  </div>

  <Transaction summary={true} />
  {#if base64}
    <div class="break-all font-mono text-xs mb-2">{p.toBase64()}</div>
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
