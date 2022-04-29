<script>
  import { session } from "$app/stores";
  import { AcceptOffer, ArtworkMedia, Activity, Avatar } from "$comp";
  import {
    canAccept,
    canCancel,
    confirm,
    err,
    info,
    ticker,
    val,
  } from "$lib/utils";
  import { formatDistanceStrict } from "date-fns";
  import { api } from "$lib/api";
  import { token, prompt } from "$lib/store";
  import Fa from "svelte-fa";
  import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

  export let offers;
  export let activebids;

  $: filteredOffers = offers.filter((o) => !o.transaction.accepted);
  $: filteredBids = activebids.filter((o) => !o.transaction.cancelled);

  let comp;
  let selectedSection = "received";

  let update = () => {
    filteredOffers = filteredOffers;
    filteredBids = filteredBids;
  };

  let cancel = async (transaction) => {
    const { id } = transaction;

    await confirm();

    await api
      .auth(`Bearer ${$session.jwt}`)
      .url("/cancel")
      .post({ id })
      .json()
      .catch(err);

    transaction.cancelled = true;
    update();

    info("Bid cancelled!");
  };
</script>

<div class="flex items-center justify-center">
  <div class="inline-flex mb-10" role="group">
    <div
      on:click={(e) => (selectedSection = "received")}
      class={`
      ${selectedSection === "received" ? "bg-primary font-bold" : "bg-gray-100"}
        rounded-l-lg
        px-6
        py-2.5
        transition
        duration-150
        ease-in-out
        cursor-pointer
        w-36
        text-center
      `}
    >
      Received
    </div>
    <div
      on:click={(e) => (selectedSection = "made")}
      class={`
      ${selectedSection === "made" ? "bg-primary font-bold" : "bg-gray-100"}
        rounded-r-lg
        px-6
        py-2.5
        transition
        duration-150
        ease-in-out
        cursor-pointer
        w-36
        text-center
      `}
    >
      Made
    </div>
  </div>
</div>

<AcceptOffer bind:this={comp} on:accepted />

{#if selectedSection === "received"}
  <table class="table-fixed w-full">
    <thead>
      <tr class="border-b">
        <th scope="col" class="py-3 px-6 text-left text-md">Item</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Price</th>
        <th scope="col" class="py-3 px-6 text-left text-md">From</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Time</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Action</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredOffers as offer}
        <tr>
          <td class="py-4 pr-6 text-sm ">
            <div class="flex flex-wrap justify-center items-center">
              <div class="w-16 rounded-md mr-1">
                <ArtworkMedia
                  artwork={offer.transaction.artwork}
                  classes="rounded-md"
                />
              </div>
              {#if offer.transaction.artwork}
                <a
                  href={`/a/${offer.transaction.artwork.slug}`}
                  class="secondary-color"
                  >{offer.transaction.artwork.title || "Untitled"}</a
                >
              {/if}
            </div>
          </td>
          <td class="py-4 px-6 text-sm "
            >{`${val(
              offer.transaction.asset,
              offer.transaction.amount
            )} ${ticker(offer.transaction.asset)}`}</td
          >
          <td class="py-4 px-6 text-sm ">
            <div class="flex">
              <div class="pr-1">
                <Avatar size="xs" user={offer.transaction.user} />
              </div>
              <a
                href={`/${offer.transaction.user.username}`}
                class="secondary-color py-3"
                >@{offer.transaction.user.username}</a
              >
            </div>
          </td>
          <td class="py-4 px-6 text-sm ">
            <div class="flex">
              <div class=" text-gray-600 text-xs w-20 ">
                {formatDistanceStrict(
                  new Date(offer.transaction.created_at),
                  new Date()
                )}
                ago
              </div>
              <a
                href={`/tx/${offer.transaction.id}`}
                class="text-sm secondary-color w-6"
                target="_blank"
              >
                <Fa class="text-sm mx-2" icon={faExternalLinkAlt} />
              </a>
            </div>
          </td>
          <td class="py-4 pl-6 text-sm ">
            {#if canAccept(offer.transaction)}
              <a
                href="/"
                on:click|preventDefault={() => {
                  comp.accept(offer.transaction, update);
                }}
                class="rounded-full bg-primary px-4 py-2"
              >
                Accept
              </a>
            {/if}
          </td>
        </tr>
      {:else}
        <div class="col-span-4 text-center mt-4">No offers yet</div>
      {/each}
    </tbody>
  </table>
{/if}

{#if selectedSection === "made"}
  <table class="table-fixed w-full">
    <thead>
      <tr class="border-b">
        <th scope="col" class="py-3 px-6 text-left text-md">Item</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Price</th>
        <th scope="col" class="py-3 px-6 text-left text-md">To</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Time</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Action</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredBids as offer}
        <tr>
          <td class="py-4 pr-6 text-sm ">
            <div class="flex flex-wrap justify-center items-center">
              <div class="w-16 rounded-md mr-1">
                <ArtworkMedia
                  artwork={offer.transaction.artwork}
                  classes="rounded-md"
                />
              </div>
              {#if offer.transaction.artwork}
                <a
                  href={`/a/${offer.transaction.artwork.slug}`}
                  class="secondary-color"
                  >{offer.transaction.artwork.title || "Untitled"}</a
                >
              {/if}
            </div>
          </td>
          <td class="py-4 px-6 text-sm "
            >{`${val(
              offer.transaction.asset,
              offer.transaction.amount
            )} ${ticker(offer.transaction.asset)}`}</td
          >
          <td class="py-4 px-6 text-sm ">
            <div class="flex">
              <div class="pr-1">
                <Avatar size="xs" user={offer.transaction.artwork.owner} />
              </div>
              <a
                href={`/${offer.transaction.artwork.owner.username}`}
                class="secondary-color py-3"
                >@{offer.transaction.artwork.owner.username}</a
              >
            </div>
          </td>
          <td class="py-4 px-6 text-sm ">
            <div class="flex">
              <div class=" text-gray-600 text-xs w-20 ">
                {formatDistanceStrict(
                  new Date(offer.transaction.created_at),
                  new Date()
                )}
                ago
              </div>
              <a
                href={`/tx/${offer.transaction.id}`}
                class="text-sm secondary-color w-6"
                target="_blank"
              >
                <Fa class="text-sm mx-2" icon={faExternalLinkAlt} />
              </a>
            </div>
          </td>
          <td class="py-4 pl-6 text-sm ">
            {#if canCancel(offer.transaction)}
              <a
                href="/"
                on:click|preventDefault={() => cancel(offer.transaction)}
                class="rounded-full bg-gray-100 border px-4 py-2"
              >
                Cancel
              </a>
            {/if}
          </td>
        </tr>
      {:else}
        <div class="col-span-4 text-center mt-4">No offers yet</div>
      {/each}
    </tbody>
  </table>
{/if}
