<svelte:options accessors={true} />

<script>
  import { edition, prompt } from "$lib/store";

  export let submit = (e) => {
    $prompt = undefined;
  };
</script>

<form on:submit|preventDefault={submit}>
  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
    Signing {$edition}
  </h3>
  <div class="mt-2">Please wait</div>
</form>
