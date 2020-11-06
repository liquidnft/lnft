<script>
  import { onMount } from "svelte";
  import SubscriptionClient from "$components/subscribe";
  import { secret } from "$components/store";

  let users = [];
  let consoleUrl = "http://localhost:8080"
  let graphqlUrl = "ws://localhost:8080/v1/graphql"

  onMount(() => {
    console.log("querying");
    const query = `
    subscription {
      users(order_by: [{ display_name: asc }]) {
        display_name
      }
    }
  `;

    const client = new SubscriptionClient(graphqlUrl, {
      lazy: true,
    });

    const subscription = client.request({ query }).subscribe({
      next({ data }) {
        console.log(data);
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
