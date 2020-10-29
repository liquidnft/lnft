<script>
  import SubscriptionClient from "./subscribe";
  import TailwindStyles from "./TailwindStyles";

  let artists = [];
  let hasura = import.meta.env.SNOWPACK_PUBLIC_HASURA;

  const query = `
    subscription {
      artists(order_by: [{ name: asc }]) {
        name
      }
    }
  `;

  const client = new SubscriptionClient(import.meta.env.SNOWPACK_PUBLIC_GRAPHQL);
  const subscription = client.request({ query }).subscribe({
    next({ data }) {
      if (data) {
        artists = [...(data.artists)];
      }
    },
  });

</script>

<div class="p-4 m-4">
  <h1 class="text-lg text-red-600 pb-2">Liquid Art</h1>
  <h2>Artists</h2>

  <ul>
    {#each artists as artist (artist.name)}
      <li>- {artist.name}</li>
    {/each}
  </ul>
  <a
    href={`${hasura}/console/data/schema/public/tables/artists/insert`}
    target="_blank"
    class="underline text-blue-600">
    Add Artist
  </a>
</div>
