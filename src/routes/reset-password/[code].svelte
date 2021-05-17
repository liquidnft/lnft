<script>
  import { page } from "$app/stores";
  import { login } from "$lib/auth";
  import { api } from "$lib/api";
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

  let password;
  let reset = async () => {
    let email = window.localStorage.getItem("email");

    api
      .url("/auth/change-password/change")
      .post({ ticket: $page.params.code, new_password: password })
      .res(() => login(email, password));
  };

  let ref;
  let pageChange = () => setTimeout(() => ref && ref.select(), 50);
  $: if (ref) pageChange($page);
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

<div class="form-container bg-lightblue">
  <form class="mb-6" on:submit|preventDefault={reset} autocomplete="off">
    <h2 class="mb-8">Reset password</h2>
    <div class="flex flex-col mb-4">
      <label class="mb-2 font-medium text-gray-600" for="password">New password</label>
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        bind:this={ref} />
    </div>
    <button class="primary-btn w-full mb-4" type="submit">Confirm</button>
    <a href="/login" class="text-midblue">
      <div class="flex">
        <Fa icon={faChevronLeft} class="my-auto mr-1" />
        <div>Back to sign in</div>
      </div>
    </a>
  </form>
</div>
