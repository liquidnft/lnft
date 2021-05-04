<script>
  import { err } from "$lib/utils";
  import { page } from "$app/stores";
  import { register } from "$lib/register";
  import ProgressLinear from "$components/ProgressLinear";

  let username = "";
  let password = "";
  let email = "";
  let registered;

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
        <a href="/login" class="secondary-color">Continue to sign in page</a>
      </p>
    {:else}
      <h2 class="mb-8">Sign up</h2>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="first_name">Email</label>
        <input placeholder="Email" bind:value={email} bind:this={ref} />
      </div>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="first_name">Username</label>
        <input placeholder="Username" bind:value={username} />
      </div>
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-medium text-gray-600"
          for="last_name">Password</label>
        <input
          placeholder="At least 8 characters."
          type="password"
          bind:value={password} />
      </div>
      <span class="block w-full">By signing up, you agree to the
        <a href="/terms-and-conditions" class="text-midblue">Terms and
          Conditions</a>
        and
        <a href="/privacy-policy" class="text-midblue">Privacy Policy</a></span>
      <div class="flex my-5 justify-end">
        <button class="primary-btn w-1/2" type="submit">Register</button>
      </div>

      <a href="/login" class="text-midblue">
        Already have an account? Sign in</a>
    {/if}
  </form>
</div>
