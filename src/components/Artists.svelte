<script>
  import { onMount } from "svelte";
  import SubscriptionClient from "$lib/subscribe";
  import { token } from "$lib/store";

  let users = [];

  let graphqlUrl;
  if (import.meta.env) {
    graphqlUrl = import.meta.env.SNOWPACK_PUBLIC_GRAPHQL
  } else {
    graphqlUrl = "wss://la.coinos.io/hasura/v1/graphql"
  } 

  onMount(() => {
    const query = `
    subscription {
      users(order_by: [{ username: asc }]) {
        username
      }
    }
  `;

    const client = new SubscriptionClient(graphqlUrl, {
      lazy: true,
    });

    const subscription = client.request({ query }).subscribe({
      next({ data }) {
        if (data) {
          users = [...data.users];
        }
      },
    });
  });
</script>

<div class="p-4 m-4">
  <ul>
    {#each users as user (user.display_name)}
      <li>- {user.display_name}</li>
    {/each}
  </ul>
</div>
