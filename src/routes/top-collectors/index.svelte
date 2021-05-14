<script>
  import { Avatar } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { topCollectors } from "$queries/users";

  export let title;
  export let stat;
  export let link = "/top-collectors";

  let collectors = [];
  let topCollectors$ = operationStore(topCollectors);
  subscription(topCollectors$, (a, b) => (collectors = b.collectors));

  $: items = collectors
    .map((u) => ({ user: u, value: u.num_artworks }))
    .splice(0, 3);
</script>

<style>
  th {
    @apply text-xs text-gray-600 uppercase font-thin text-left;
  }

  @media only screen and (max-width: 800px){
    .table-container{
      overflow-x: scroll;
    }
    .table-auto{
      min-width: 800px;
      overflow-x: scroll;
    }
  }
</style>

<div class="container mx-auto mt-20">
  <h1 class="title">Top Collectors</h1>
  <div class="table-container">
  <table class="w-full table-auto">
    <tr class="border-gray-200 border-b">
      <th>Collector</th>
      <th>Works collected</th>
      <th>Works owned</th>
      <th>Works resold</th>
      <th>Avg. purchase price</th>
      <th>Total price paid</th>
    </tr>
    {#each collectors as item}
      <tr class="border-b">
        <td class="py-4">
          <div class="flex">
            <Avatar user={item} />
            <div class="ml-2 my-auto font-bold">
              <a href={`/u/${item.username}`}>@{item.username}</a>
            </div>
          </div>
        </td>
        <td>{item.collected}</td>
        <td>{item.owned}</td>
        <td>{item.resold}</td>
        <td>{item.avg_price ? item.avg_price : '-'}</td>
        <td>{item.total_price ? item.total_price : '-'}</td>
      </tr>
    {/each}
  </table>
  </div>
</div>
