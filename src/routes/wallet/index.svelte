<script>
  import { onMount } from "svelte";
  import { liquid } from "$lib/api";
  import QrCode from "svelte-qrcode"
  import { user, token } from "$lib/store";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  let createAddress = 
{
  query: `mutation create_address($address: address_insert_input!) {
    insert_addresses_one(object: $address) {
      id,
      user_id
    } 
  }`,
}

  let wallet = {
    balance: 0,
  } 

  let address;
  onMount(async () => {
    address = await liquid.url("/address").get().text();

  }) 
</script>

<h1 class="title">Wallet</h1>

<QrCode value={address} />
{address}

<div>
Balance: {wallet.balance}
</div>
