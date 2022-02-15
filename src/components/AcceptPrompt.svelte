<svelte:options accessors={true} />

<script>
  import { prompt, acceptStatus } from "$lib/store";
  import { copy, err } from "$lib/utils";
  import { ACCEPTED, CANCELLED } from "../lib/wallet";

  export const submit = async (e) => {
    try {
      $acceptStatus = ACCEPTED;
    } catch (e) {
      err(e);
    }

    $prompt = undefined;
  };

  export const cancel = async (e) => {
    try {
      $acceptStatus = CANCELLED;
    } catch (e) {
      err(e);
    }

    $prompt = undefined;
  };
</script>

<div class="flex justify-between">
  <h1 class="font-black text-4xl primary-color">Are you sure?</h1>
</div>
