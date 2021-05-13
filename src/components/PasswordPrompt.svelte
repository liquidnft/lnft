<script>
  import { tick } from "svelte";
  import { prompt, password, user, token } from "$lib/store";
  import { api } from "$lib/api";
  import { err } from "$lib/utils";

  let attempt = "";
  let input;

  let focus = (p) => p && tick().then(() => input.select());
  $: focus($prompt);

  export let submit = (e) => {
    if (e) e.preventDefault();

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

<svelte:options accessors={true} />
<form on:submit={submit}>
  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
    Enter password
  </h3>
  <div class="mt-2">
    <input
      bind:value={attempt}
      placeholder="Password"
      class="mb-2"
      type="password"
      bind:this={input} />
  </div>
</form>
