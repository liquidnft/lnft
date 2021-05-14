<script>
  import { Avatar } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { topArtists } from "$queries/users";

  export let title;
  export let stat;

  let artists = [];
  let topArtists$ = operationStore(topArtists);
  subscription(topArtists$, (a, b) => (artists = b.artists));

  $: items = artists
    .map((u) => ({ user: u, value: u.num_artworks }))
    .splice(0, 3);
</script>

<style>
  th {
    @apply text-xs text-gray-600 uppercase font-thin text-left;
  }

  @media only screen and (max-width: 800px) {
    .table-container {
      overflow-x: scroll;
    }
    .table-auto {
      min-width: 800px;
      overflow-x: scroll;
    }
  }
</style>

<div class="container mx-auto mt-20">
  <h1 class="title">Top Artists</h1>
  <div class="table-container">
    <table class="w-full table-auto">
      <tr class="border-gray-200 border-b">
        <th>Artist</th>
        <th>Total sales</th>
        <th>Works created</th>
        <th>Works sold</th>
        <th>Avg. sale price</th>
        <th>Highest sale price</th>
      </tr>
      {#each artists as item}
        <tr class="border-b">
          <td class="py-4">
            <div class="flex">
              <Avatar user={item} />
              <div class="ml-2 my-auto font-bold">
                <a href={`/u/${item.username}`}>@{item.username}</a>
              </div>
            </div>
          </td>
          <td>{item.total_sales ? item.total_sales : '-'}</td>
          <td>{item.creations}</td>
          <td>{item.sold}</td>
          <td>{item.avg_sale ? item.avg_sale : '-'}</td>
          <td>{item.highest_sale ? item.highest_sale : '-'}</td>
        </tr>
      {/each}
    </table>
  </div>
</div>
