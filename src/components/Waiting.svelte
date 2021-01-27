<script>
  import { poll, psbt, prompt } from "$lib/store";
  import { electrs } from "$lib/api";

  let getStatus = async () => {
    let txid = $psbt.extractTransaction().getId();
    let { confirmed } = await electrs.url(`/tx/${txid}/status`).get().json();
    if (confirmed) {
      $prompt = "success";
      $prompt = undefined;
      clearInterval($poll);
      console.log("clear!");
      $poll = undefined;
    }
  };

  $poll = setInterval(getStatus, 2000);
  export let submit = () => {};
  export let hide = true;
</script>

<svelte:options accessors={true} />

<h1 class="text-xl font-bold">Waiting For Confirmation</h1>
