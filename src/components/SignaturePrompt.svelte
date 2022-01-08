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
<div class="flex justify-between items-center my-6">
  <button
    class="secondary-btn copy-transaction"
    on:click={() => copy($psbt.toBase64())}>Copy transaction</button
  >
  <div>
    <input
      type="checkbox"
      id="remove_prompt_sign"
      bind:checked={remove_prompt_sign}
    />
    <label for="remove_prompt_sign">Disable next sign prompts</label>
    <span class="tooltip">
      <i class="text-midblue text-xl">
        <Fa icon={faQuestionCircle} />
      </i>
      <span class="tooltip-text bg-gray-100 shadow ml-4 rounded"
        >This option can be edited from the user profile.</span
      >
    </span>
  </div>
</div>
<hr class="mb-4" />

<Transaction summary={true} />
{#if base64}
  <div class="break-all font-mono text-xs mb-2">{$psbt.toBase64()}</div>
{/if}

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
  .secondary-btn.copy-transaction {
    font-size: 16px;
    line-height: 22px;
    padding: 0 20px;
  }
  label {
    line-height: 22px;
  }

  .tooltip {
    cursor: pointer;
    display: inline-block;
  }
  .tooltip .tooltip-text {
    display: none;
    padding: 15px;
    position: absolute;
    z-index: 100;
    width: 300px;
    right: 20px;
    font-style: normal;
  }
  .tooltip:hover .tooltip-text {
    display: block;
  }
</style>
