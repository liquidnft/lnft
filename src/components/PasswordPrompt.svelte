<svelte:options accessors={true} />

<script>
  import { tick } from "svelte";
  import { prompt, password, user, token } from "$lib/store";
  import { api } from "$lib/api";
  //  import { err } from "$lib/utils";

  let attempt = "liquidart";
  let input;

  let focus = (p) => p && tick().then(() => input.select());
  $: focus($prompt);

  export let submit = (e) => {
    if (e) e.preventDefault();

    api
      .url("/auth/login")
      .post({
        email: `${$user.username}@liquidart.com`,
        password: attempt,
      })
    //.badRequest(err)
    // .unauthorized(err)
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem("token", $token);
        $password = attempt;
        $prompt = undefined;
      });
  };
</script>

<form on:submit={submit}>
  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
    Enter password
  </h3>
  <div class="mt-2">
    <input bind:value={attempt} placeholder="Password" class="mb-2" bind:this={input} />
  </div>
</form>
