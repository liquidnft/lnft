<script>
  import qrcode from "qrcode-generator-es6";
  import { user } from "$lib/store";
  import { copy } from "$lib/utils";

  export let funding;

  let img;

  $: if ($user && $user.address) {
    const qr = new qrcode(0, "H");
    qr.addData($user.address);
    qr.make();
    img = qr.createSvgTag({});
  }
</script>

{#if $user && funding}
  <div class="dark mb-2 rounded-lg">
    <div class="flex justify-between place-items-center text-gray-400">
      <p>Fund Wallet</p>
      <button
        class="text-gray-400 text-xl"
        on:click={() => (funding = false)}><i class="fas fa-times" /></button>
    </div>
    <div class="mb-2 flex justify-center flex-col">
      <div class="flex mb-2">
        <div class="mx-auto w-1/2 qr mt-6 mb-3">
          {@html img}
        </div>
      </div>
      <div class="text-center text-sm text-gray-500">{$user.address}</div>
      <button
        on:click={() => copy($user.address)}
        class="center font-medium secondary-color">COPY ADDRESS
        <i class="far fa-clone ml-2" /></button>
    </div>
  </div>
{/if}
