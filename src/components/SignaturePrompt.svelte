<svelte:options accessors={true} />

<script>
  import { psbt, prompt, user, signStatus } from "$lib/store";
  import { Transaction } from "$comp";
  import { copy, err } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import { SIGN_ACCEPTED, SIGN_CANCELLED } from "../lib/wallet";
  import { query } from "$lib/api";
  import { updateUser } from "$queries/users";
  import Fa from "svelte-fa";
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

  let remove_prompt_sign = false;

  const disableSignPrompts = async () => {
    await query(updateUser, {
      user: { prompt_sign: false },
      id: $user.id,
    });
    $user.prompt_sign = false;
  };

  export const submit = async (e) => {
    await requirePassword();

    try {
      $signStatus = SIGN_ACCEPTED;

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
      $signStatus = SIGN_CANCELLED;

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

<div class="flex justify-between">
  <h1 class="font-black text-4xl primary-color">Sign transaction</h1>
</div>

<Transaction summary={true} />
{#if base64}
  <div class="break-all font-mono text-xs mb-2">{$psbt.toBase64()}</div>
{/if}

<div class="flex justify-between items-center my-6">
  <div class="flex">
    <input
      type="checkbox"
      id="remove_prompt_sign"
      bind:checked={remove_prompt_sign}
      class="my-auto mr-2"
    />
    <label for="remove_prompt_sign" class="my-auto mr-1">&nbsp;Don't ask me again</label>
  </div>
</div>

<style>
  input[type="checkbox"] {
    appearance: none;
    border: 3px solid #6ed8e0;
    background-color: #fff;
    padding: 0;
    margin-right: 3px;
    border-radius: 0;
    width: 17px;
    height: 17px;
  }

  input[type="checkbox"]:checked {
    border: none;
    background-color: #6ed8e0;
  }
  label {
    line-height: 22px;
  }
</style>
