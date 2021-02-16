<script>
  import { goto } from "$lib/utils";
</script>

<div class="w-3/4">
  <p class="text-xl mb-10">
    You'll need to know your backup phrase to start. Some things to have in
    mind:
  </p>

  <ul class="flex flex-col gap-10 mb-10">
    <li class="flex gap-4">
      <i class="fas fa-sticky-note text-lightblue"></i>
      <span class="-mt-1">Write on actual paper instead of keeping it in a digital format in your
      device.</span>
    </li>
    <li class="flex gap-4">
      <i class="fa fa-lock text-lightblue"></i>
      <span class="-mt-1">Wait until you are in a personal device and in a private environment.</span>
    </li>
    <li class="flex gap-4">
      <i class="fas fa-wallet text-lightblue"></i>
      <span class="-mt-1">The backup phrase is essential to restore your wallet. Make sure its
      accurate and kept safe.</span>
    </li>
  </ul>

  <button on:click={() => goto('/wallet/create/step2')} class="primary-btn w-full">I'm ready to start</button>
</div>
