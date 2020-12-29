<script>
  import { prompt, password, user, token } from "$lib/store";
  import { api } from "$lib/api";

  let attempt = "liquidart";

  let login = (e) => {
    if (e) e.preventDefault();

    api
      .url("/auth/login")
      .post({
        email: `${$user.username}@liquidart.com`,
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
      });
  };
</script>

{#if $user && $prompt}
  <form on:submit={login}>
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" />
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline">
                Enter password
              </h3>
              <div class="mt-2">
                <input
                  bind:value={attempt}
                  placeholder="Password"
                  class="mb-2" autofocus />
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
            Ok
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={() => ($prompt = false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  </form>
{/if}
