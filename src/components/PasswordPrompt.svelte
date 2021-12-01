<script>
  import { tick } from "svelte";
  import { prompt, password, user, token } from "$lib/store";
  import { api } from "$lib/api";
  import { err, dev } from "$lib/utils";
  import Fa from "svelte-fa";
  import {
    faTimes,
    faEye,
    faEyeSlash,
  } from "@fortawesome/free-solid-svg-icons";

  let attempt = dev ? "liquidart" : "";
  let input;
  let show;

  let focus = (p) => p && tick().then(() => input.focus());
  $: focus($prompt);

  export let submit = (e) => {
    api
      .url("/login")
      .post({
        email: $user.username,
        password: attempt,
      })
      .badRequest(err)
      .unauthorized(err)
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem("password", attempt);
        window.sessionStorage.setItem("token", $token);
        $password = attempt;
        $prompt = undefined;
      })
      .catch(err);
  };

</script>

<style>
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
  }

  input {
    width: 100%;
    border-radius: 8px;
  }

  .closeBtn {
    padding: 10px 13px;
  }

</style>

<svelte:options accessors={true} />
<form on:submit|preventDefault={submit}>
  <div class="dialog-header">
    <h3 id="modal-headline">Enter password</h3>
    <button
      type="button"
      class="closeBtn text-xl ml-auto font-thin w-10 h-10 bg-gray-100 rounded rounded-full"
      on:click={() => ($prompt = undefined)}>
      <Fa icon={faTimes} />
    </button>
  </div>
  <div class="mt-2">
    <div class="relative mb-2">
      {#if show}
        <input
          bind:value={attempt}
          placeholder="Password"
          class="w-full"
          bind:this={input} />
      {:else}
        <input
          bind:value={attempt}
          placeholder="Password"
          class="w-full"
          type="password"
          bind:this={input} />
      {/if}
      <button
        class="flex h-full top-0 absolute px-3 right-0 w-auto"
        type="button"
        on:click|preventDefault|stopPropagation={() => (show = !show)}>
        <Fa icon={show ? faEyeSlash : faEye} class="my-auto mr-1" />
      </button>
    </div>
    <div class="text-right text-sm">
      <a href="/forgot-password" class="block w-full text-midblue">Forgot
        password?</a>
    </div>
  </div>
</form>
