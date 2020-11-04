<script>
  import { secret } from "./store";
  import wretch from "wretch";

  const api = wretch().url("http://localhost:3000");

  let error;
  let email = "real@emailadress.com";
  let password = "StrongPasswordNot1234";

  let login = () => {
    console.log("logigng in");
    api
      .url("/auth/login")
      .post({
        email,
        password,
      })
      .json((r) => ($secret = r.jwt_token));
  };

  let register = () => {
    api
      .url("/auth/register")
      .post({
        email,
        password,
      })
      .badRequest((err) => {
        error = JSON.parse(err.message).message;
      })
      .res(() => {
        console.log("yeah");
        login();
      });
  };
</script>

<style>
  input {
    @apply shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight;
  }
</style>

{#if error}
  <div>{error}</div>
{/if}

<form on:submit|preventDefault={login} class="mt-4">
  <input placeholder="Email" bind:value={email} />
  <input placeholder="Password" type="password" bind:value={password} />

  <button
    class="border shadow px-4 bg-green-400"
    on:click|preventDefault={register}>Register</button>
  <button class="border shadow px-4 bg-blue-400" type="submit">Login</button>
</form>
