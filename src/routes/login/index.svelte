<script>
  import { page } from "$app/stores";
  import { prompt, password, user, token } from "$lib/store";
  import { goto } from "$lib/utils";
  import { api } from "$lib/api";
  import cryptojs from "crypto-js";
  import { generateMnemonic } from "bip39";
  import { tick } from "svelte";
  import { keypair, singlesig, multisig } from "$lib/wallet";

  let error;
  let username = "anon";
  let attempt = "liquidart";

  let setupWallet = (attempt) => {
    let mnemonic = cryptojs.AES.encrypt(generateMnemonic(), attempt).toString();
    let key = keypair(mnemonic, attempt);
    let { address } = singlesig(key);
    let { address: ms } = multisig(key);

    return {
      address,
      pubkey: key.base58,
      mnemonic,
      multisig: ms,
    };
  };

  let usernameInput;
  let pageChange = () => setTimeout(() => usernameInput.select(), 50);
  $: if (usernameInput) pageChange($page);

  let login = () => {
    api
      .url("/auth/login")
      .post({
        email: `${username}@liquidart.com`,
        password: attempt,
      })
      .badRequest((err) => {
        error = JSON.parse(err.message).message;
      })
      .unauthorized((err) => (error = "Login failed"))
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem("token", $token);
        $password = attempt;
        $prompt = false;
        goto("/market");
      });
  };

  let registered = false;
  let register = () => {
    api
      .url("/auth/register")
      .post({
        email: `${username}@liquidart.com`,
        password: attempt,
        user_data: {
          username,
          full_name: username,
          ...setupWallet(attempt),
        },
      })
      .badRequest((err) => {
        error = JSON.parse(err.message).message;
      })
      .res(() => {
        registered = true;
        login();
      });
  };
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
    @apply appearance-none border rounded py-4 px-3 text-gray-700 leading-tight;
  }

  span{ cursor: pointer;}

  @media only screen and (max-width: 640px) {
    .form-container {
      background: none;
      height: auto;
    }

    .form-container form{
      box-shadow: none;
      padding: 0.2rem;
      margin-top: 50px;
    }
  }
</style>


  {#if error}
    <div
      class="container mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}

  <div class="form-container bg-lightblue">
    <form class="mb-6" on:submit|preventDefault={login} autocomplete="off">
      <h2 class="mb-8">Sign In</h2>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="first_name">Email or username</label>
        <input
          placeholder="username"
          bind:value={username}
          bind:this={usernameInput} />
      </div>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="last_name">Password</label>
        <input placeholder="Password" type="password" bind:value={attempt} />
      </div>
      <span class="block w-full text-midblue" on:click|preventDefault={register}>Forgot password?</span>
      <div class="flex my-5 justify-end">
        <button class="primary-btn w-1/2" type="submit">Sign In</button>
      </div>
      <span class="text-midblue" on:click|preventDefault={register}>Don't have an account? Sign up</span>
    </form>
  </div>
