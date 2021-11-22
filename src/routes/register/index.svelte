<script>
  import Fa from "svelte-fa";
  import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { err, dev } from "$lib/utils";
  import { page } from "$app/stores";
  import { register } from "$lib/register";
  import { ProgressLinear } from "$comp";

  let show;
  let username = "";
  let password = dev ? "liquidart" : "";
  let email = dev ? makeid(6) + "@a.com" : "";
  let registered;

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let ref;
  let pageChange = () => setTimeout(() => ref && ref.select(), 50);
  $: if (ref) pageChange($page);

  let loading;
  let submit = async () => {
    loading = true;

    try {
      await register(email, username, password);
      registered = true;
    } catch (e) {
      err(e);
    }

    loading = false;
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
  <form class="mb-6" on:submit|preventDefault={submit} autocomplete="off">
    {#if loading}
      <ProgressLinear />
    {:else if registered}
      <h2 class="mb-8">Registered!</h2>
      <p>
        Thanks for registering. Please check your email for an activation link.
      </p>

      <p class="mt-4">
        <a href="/login" class="text-secondary">Continue to sign in page</a>
      </p>
    {:else}
      <h2 class="mb-8">Sign up</h2>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="first_name">Email</label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          bind:value={email}
          bind:this={ref} />
      </div>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="first_name">Username</label>
        <input
          id="username"
          name="username"
          placeholder="Username"
          autocapitalize="off"
          bind:value={username} />
      </div>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="last_name">Password</label>
        <div class="relative">
          {#if show}
            <input
              class="w-full"
              bind:value={password}
              autocapitalize="off"
              id="password"
              name="password"
              placeholder="At least 8 characters." />
          {:else}
            <input
              class="w-full"
              type="password"
              bind:value={password}
              autocapitalize="off"
              id="password"
              name="password"
              placeholder="At least 8 characters." />
          {/if}
          <button
            class="absolute h-full px-3 right-0 top-0 w-auto"
            type="button"
            on:click|preventDefault|stopPropagation={() => (show = !show)}>
            <Fa icon={show ? faEyeSlash : faEye} class="my-auto mr-1" />
          </button>
        </div>
      </div>
      <span class="block w-full">By signing up, you agree to the
        <a href="/terms-and-conditions">Terms and
          Conditions</a>
        and
        <a href="/privacy-policy">Privacy Policy</a></span>
      <div class="flex my-5 justify-end">
        <button class="primary-btn w-full" type="submit">Register</button>
      </div>

      <a href="/login" class="text-midblue">
        Already have an account? Sign in</a>
    {/if}
  </form>
</div>
