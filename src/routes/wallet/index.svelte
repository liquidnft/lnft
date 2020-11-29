<script>
  import { onMount } from "svelte";
  import { liquid } from "$lib/api";
  import QrCode from "svelte-qrcode"

  let address;
  onMount(async () => {
    address = await liquid.url("/hello").get().text();
  }) 
</script>

<h1 class="title">Wallet</h1>

<QrCode value={address} />
{address}
