<script>
  import { page } from "$app/stores";
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

  let email;
  let forgot;
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

<div class="form-container bg-lightblue" key={$page.path}>
  <form
    class="mb-6"
    on:submit|preventDefault={() => forgot(email)}
    autocomplete="off">
    <h2 class="mb-8">Recover password</h2>
    <p class="my-4">
      We'll send a recovery link to the email associated with your account.
    </p>
    <div class="flex flex-col mb-4">
      <label class="mb-2 font-medium text-gray-600" for="email">Email</label>
      <input placeholder="Email" bind:value={email} bind:this={ref} />
    </div>
    <div class="flex">
      <button class="primary-btn ml-auto mb-4" type="submit">Send</button>
    </div>
    <a href="/login" class="text-midblue">
      <div class="flex">
      <Fa icon={faChevronLeft} class="my-auto mr-1" />
      <div>Back to sign in</div>
    </div>
    </a>
  </form>
</div>
