<script>
  import { page } from "$app/stores";
  import { err, goto } from "$lib/utils";
  import { api } from "$lib/api";
  import cryptojs from "crypto-js";
  import { generateMnemonic } from "bip39";
  import { tick } from "svelte";
  import { keypair, singlesig, multisig } from "$lib/wallet";
  import { login } from "$lib/auth";
  import { user } from "$lib/store";

  let username = "";
  let password = "";

  let usernameInput;
  let pageChange = () => setTimeout(() => usernameInput && usernameInput.select(), 50);
  $: if (usernameInput) pageChange($page);

  $: if ($user) goto('/landing');
</script>

<style>
  .form-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .form-container form {
    width: 100%;
    max-width: 450px;
    background-color: white;
    padding: 40px;
    box-shadow: 0 1px 5px rgb(0 0 0 / 18%);
    border-radius: 10px;
  }

  input {
    @apply appearance-none border rounded text-gray-700 leading-tight;
    padding: 0;
    padding: 10px;
  }

  span {
    cursor: pointer;
  }

  @media only screen and (max-width: 640px) {
    .form-container {
      background: none;
      height: auto;
    }

    .form-container form {
      box-shadow: none;
      padding: 0.2rem;
      margin-top: 50px;
    }
  }
</style>

<div class="form-container bg-lightblue px-4">
  <form
    class="mb-6"
    on:submit|preventDefault={() => login(username, password)}
    autocomplete="off">
    <h2 class="mb-8">Sign In</h2>
    <div class="flex flex-col mb-4">
      <label class="mb-2 font-medium text-gray-600" for="first_name">Email or
        username</label>
      <input
        bind:value={username}
        bind:this={usernameInput} />
    </div>
    <div class="flex flex-col mb-4">
      <label
        class="mb-2 font-medium text-gray-600"
        for="last_name">Password</label>
      <input type="password" bind:value={password} />
    </div>
    <a href="/forgot-password" class="block w-full text-midblue">Forgot
      password?</a>
    <div class="flex my-5 justify-end">
      <button class="primary-btn w-1/2" type="submit">Sign In</button>
    </div>
    <a href="/register" class="text-midblue">Don't have an account? Sign up</a>
  </form>
</div>

