<script context="module">
  export async function load({ session }) {
    if (session && session.user) {
      return {
        status: 301,
        redirect: "/",
      };
    }

    return {};
  }
</script>

<script>
  import Fa from "svelte-fa";
  import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { page, session } from "$app/stores";
  import { dev, err, goto } from "$lib/utils";
  import { post } from "$lib/api";
  import cryptojs from "crypto-js";
  import { tick } from "svelte";
  import { keypair, singlesig, multisig } from "$lib/wallet";
  import { token, user } from "$lib/store";
  import { onMount } from "svelte";

  let show;
  let email = "";
  let password = dev ? "liquidart" : "";

  let emailInput;
  let pageChange = () =>
    setTimeout(() => emailInput && emailInput.select(), 50);
  $: if (emailInput) pageChange($page);

  let login = async () => {
    try {
      let res = await post("/auth/login", { email, password }, fetch).json();

      $user = res.user;
      $token = res.jwt_token;
      $session = { user: $user };
      window.sessionStorage.setItem("password", password);

      goto("/");
    } catch (e) {
      err(e);
    }
  };

  onMount(() => {
    session.set(null);
    token.set(null);
    user.set(null);
  });
</script>

<div class="form-container bg-lightblue px-4">
  <form class="mb-6" on:submit|preventDefault={login} autocomplete="off">
    <h2 class="mb-8">Sign In</h2>
    <div class="flex flex-col mb-4">
      <label class="mb-2 font-medium" for="first_name">Email or username</label>
      <input
        bind:value={email}
        bind:this={emailInput}
        autocapitalize="off"
        data-cy="user"
      />
    </div>
    <div class="flex flex-col mb-4">
      <label class="mb-2 font-medium" for="last_name">Password</label>
      <div class="relative">
        {#if show}
          <input class="w-full" bind:value={password} autocapitalize="off" />
        {:else}
          <input
            class="w-full"
            type="password"
            bind:value={password}
            autocapitalize="off"
            data-cy="password"
          />
        {/if}
        <button
          class="absolute h-full px-3 right-0 top-0 w-auto"
          type="button"
          on:click|preventDefault|stopPropagation={() => (show = !show)}
        >
          <Fa icon={show ? faEyeSlash : faEye} class="my-auto mr-1" />
        </button>
      </div>
    </div>
    <a href="/forgot-password" class="block w-full text-midblue"
      >Forgot password?</a
    >
    <div class="flex my-5 justify-end">
      <button class="primary-btn w-full" type="submit">Sign In</button>
    </div>
    <a href="/register" class="text-midblue">Don't have an account? Sign up</a>
  </form>
</div>

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
    @apply appearance-none border rounded leading-tight;
    padding: 0;
    padding: 10px;
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
