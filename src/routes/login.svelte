<script>
  import { token } from "$components/store";
  import wretch from "wretch";

  const api = wretch().url("/api");

  let error;
  let email = "real@emailadress.com";
  let password = "StrongPasswordNot1234";

  let login = () => {
    api
      .url("/auth/login")
      .post({
        email,
        password,
      })
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem('token', $token);
        window.location = '/issue';
      }); 
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
      .res(login);
  };
</script>

<style>
  input {
    @apply shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight;
  }

  button {
    @apply border shadow px-4 py-1;
  }
</style>

{#if error}
  <div>{error}</div>
{/if}

<form on:submit|preventDefault={login} class="mt-4">
  <input placeholder="Email" bind:value={email} />
  <input placeholder="Password" type="password" bind:value={password} />

  <button
    on:click|preventDefault={register}
    class="bg-green-400">Register</button>
  <button class="bg-blue-400" type="submit">Login</button>
</form>
