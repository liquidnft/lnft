<script>
  import SubscriptionClient from "../subscribe";

  let authors = [];

  const query = `
    subscription {
      author(order_by: [{ name: asc }]) {
        name
      }
    }
  `;

  const client = new SubscriptionClient("ws://localhost:8080/v1/graphql");
  const subscription = client.request({ query }).subscribe({
    next({ data }) {
      if (data) {
        let { author } = data;
        authors = [...author];
      }
    },
  });
</script>

<div class="p-4 m-4">
  <h1 class="text-lg text-red-600 pb-2">Liquid Art</h1>
  <h2>Artists</h2>
  <ul>
    {#each authors as author (author.name)}
      <li>- {author.name}</li>
    {/each}
  </ul>
<a
  href="https://la.coinos.io/hasura/console/data/schema/public/tables/artists/insert" target="_self" class="underline text-blue-600">
  Add Artist
</a>
</div>


