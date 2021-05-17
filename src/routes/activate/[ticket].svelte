<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { activate } from "$lib/auth";
  import ProgressLinear from "$components/ProgressLinear";
  import { err } from "$lib/utils";

  let loading = true;
  let success;
  onMount(async () => {
    try {
      await activate($page.params.ticket);
      success = true;
    } catch (e) {
      err(e);
    }
    loading = false;
  });
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

<div class="form-container bg-lightblue px-4">
  <form class="mb-6" autocomplete="off">
    {#if loading}
      <ProgressLinear />
    {:else if success}
      <h2 class="mb-8">Email confirmed!</h2>
      <p>Thank you! Your email is verified.</p>

      <div class="flex">
        <div class="ml-auto mt-8">
          <a href="/login" class="primary-btn">Continue to Raretoshi</a>
        </div>
      </div>
    {:else}
      <h2 class="mb-8">Something went wrong</h2>
      <div class="flex">
        <div class="ml-auto mt-8">
          <a href="/login" class="primary-btn">Continue to Raretoshi</a>
        </div>
      </div>
    {/if}
  </form>
</div>
