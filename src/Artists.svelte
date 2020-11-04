<script>
  import { onMount } from "svelte";
  import SubscriptionClient from "./subscribe";
  import TailwindStyles from "./TailwindStyles";
  import { secret } from "./store";

  let users = [];
  let consoleUrl = import.meta.env.SNOWPACK_PUBLIC_HASURA;
  let graphqlUrl = import.meta.env.SNOWPACK_PUBLIC_GRAPHQL;

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
  <h1 class="text-lg text-red-600 pb-2">Liquid Art</h1>
  <h2>users</h2>

  <ul>
    {#each users as user (user.display_name)}
      <li>- {user.display_name}</li>
    {/each}
  </ul>
  <a
    href={`${consoleUrl}/console/data/schema/public/tables/users/insert`}
    target="_blank"
    class="underline text-blue-600">
    Add user
  </a>
</div>
