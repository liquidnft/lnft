<script>
  import qrcode from "qrcode-generator-es6";
  import { user } from "$lib/store";
  import { copy } from "$lib/utils";

  const qr = new qrcode(0, "H");
  qr.addData($user.address);
  qr.make();

  let img = qr.createSvgTag({});
</script>

<div class="dark mb-2">
  <h1>Fund Wallet</h1>
  <div class="mb-2">
    <div class="flex mb-2">
      <div class="mx-auto w-1/2 qr">
        {@html img}
      </div>
    </div>
      <div class="text-center">{$user.address}</div>
      <button on:click={() => copy($user.address)}>Copy Address</button>
  </div>
</div>
