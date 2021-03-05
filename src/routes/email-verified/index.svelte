<script>
  import { goto } from "$lib/utils";
  import { page } from "$app/stores";

  let email;
  let forgot;
  let ref;
  let pageChange = () => setTimeout(() => ref.select(), 50);
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

<div class="form-container bg-lightblue" />
<h2 class="mb-8">Recover password</h2>
<p class="my-4">
  We'll send a recovery link in the email associated with your account.
</p>

<a class="primary-btn w-full" href="/">Continue to Raretoshi</a>
