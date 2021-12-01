<script>
  import { createEventDispatcher } from "svelte";
  import { royaltyRecipientIndividualType, err } from "$lib/utils";
  const dispatch = createEventDispatcher();

  export let defaultName;
  export let defaultAddress;

  const recipientModel = {
    name: "",
    amount: 1,
    address: "",
    type: royaltyRecipientIndividualType,
  };

  let recipient = {
    ...recipientModel,
    ...{ address: defaultAddress, name: defaultName },
  };

  const onSubmit = (e) => {
    if (!recipient.name.length)
      return err("Please enter a name for the recipient.");
    if (recipient.amount <= 0)
      return err("Please enter an amount percentage for the recipient.");
    if (!recipient.address)
      return err("Please enter an address for the recipient.");

    dispatch("addrecipient", {
      newRecipient: recipient,
      cb: () => {
        recipient = { ...recipientModel };
      },
    });
  };

</script>

<style>
  input[type="submit"] {
    height: 54px;
    font-size: 0.9rem;
  }

  input {
    @apply rounded-lg mb-4 mt-2;
    &:disabled {
      @apply bg-gray-100;
    }
  }

</style>

<form
  class="w-full mb-6 mt-6"
  autocomplete="off"
  on:submit|preventDefault={onSubmit}>
  <div class="flex flex-wrap w-full mb-4">
    <div class="mt-1 rounded-md md:w-4/5 w-full md:pr-6">
      <label for="recipientName">Name</label>
      <input
        class="form-input block w-full pl-4 pr-4"
        type="text"
        bind:value={recipient.name}
        placeholder="Recipient Name"
        id="recipientName" />
    </div>
    <div class="mt-1 rounded-md md:w-1/5 w-1/2">
      <label for="recipientAmount">Rate (%)</label>
      <input
        class="form-input block w-full pl-4 pr-1"
        type="number"
        step="1"
        min="1"
        bind:value={recipient.amount}
        placeholder="Amount Percent"
        id="recipientAmount" />
    </div>
    <!-- <div class="mt-1 rounded-md md:w-1/5 w-1/2">
      <label for="recipientAmount">Currency</label>
      <Select
        items={Object.keys(tickers).map((tickerIndex, mapIndex) => {
          const ticker = tickers[tickerIndex];
          return { value: tickerIndex, label: ticker.ticker };
        })}
        showChevron={true}
        isClearable={false}
        placeholder="Currency"
        selectedValue={tickers[defaultAskingAsset].ticker}
        on:select={(e) => {
          recipient.asking_asset = e.detail.value;
        }}
      />
    </div> -->
  </div>
  <div class="flex w-full mb-4">
    <div class="mt-1 rounded-md w-4/5 pr-6">
      <label for="recipientAddress">Address</label>
      <input
        class="form-input block w-full pl-4 pr-4"
        type="text"
        bind:value={recipient.address}
        placeholder="Recipient Address"
        id="recipientAddress" />
    </div>
    <div class="mt-1 rounded-md w-1/5 pt-8">
      <input
        type="submit"
        class="primary-btn btn-sm cursor-pointer mx-auto"
        value="Add Recipient" />
    </div>
  </div>
</form>
