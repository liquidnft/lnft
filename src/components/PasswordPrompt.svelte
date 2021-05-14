<script>
  import { tick } from "svelte";
  import { prompt, password, user, token } from "$lib/store";
  import { api } from "$lib/api";
  import { err } from "$lib/utils";
  import Fa from "svelte-fa";
  import { faTimes, faEye } from "@fortawesome/free-solid-svg-icons";

  let attempt = "";
  let input;

  let focus = (p) => p && tick().then(() => input.select());
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
      });
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
    <input
      bind:value={attempt}
      placeholder="Password"
      class="mb-2"
      type="password"
      bind:this={input} />
  </div>
</form>
