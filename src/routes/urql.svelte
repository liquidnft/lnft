<script>
  import { token } from "$lib/store";
  import {
    operationStore,
    createClient,
    setClient,
    defaultExchanges,
    subscriptionExchange,
    subscription,
  } from "@urql/svelte";
  import { SubscriptionClient } from "subscriptions-transport-ws";
  const subscriptionClient = new SubscriptionClient(
    "ws://localhost:8080/v1/graphql"
  );

  const client = createClient({
    url: "/graphql",
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription(operation) {
          return subscriptionClient.request(operation);
        },
      }),
    ],
  });

  setClient(client);

  let limit = 2;
  let offset = 0;
  const artworks = operationStore(
    `
    subscription ($offset: Int!, $limit: Int!) {
      artworks(limit: $limit, offset: $offset) {
        id
        title
      }
    }
  `,
    { limit, offset }
  );

  const handleSubscription = (messages = [], data) => {
    return [data.artworks, ...messages];
  };

  subscription(artworks);
</script>

<button on:click={() => $artworks.variables.limit++}>More</button>
<button on:click={() => $artworks.variables.limit--}>Less</button>

<button
  on:click={() => ($artworks.variables.offset += $artworks.variables.limit)}>Next</button>
<button
  on:click={() => ($artworks.variables.offset -= $artworks.variables.limit)}>Prev</button>

{#if !$artworks.data}
  <p>Loading...</p>
{:else}
  <ul>
    {#each $artworks.data.artworks as artwork}
      <li>{artwork.title}</li>
    {/each}
  </ul>
{/if}
