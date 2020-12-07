<script>
  import { Avatar } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { getCollectors } from "$queries/users";

  export let title;
  export let stat;
  export let link = "/top-collectors";

  let collectors = [];
  let getCollectors$ = operationStore(getCollectors);
  subscription(getCollectors$, (a, b) => (collectors = b.collectors));

  $: items = collectors
    .map((u) => ({ user: u, value: u.num_artworks }))
    .splice(0, 3);
</script>

<style>
  th {
    @apply text-xs text-gray-600 uppercase font-thin text-left;
  }
</style>

<h1 class="title">Largest Collections</h1>

<table class="w-full table-auto">
  <tr class="border-gray-200 border-b">
    <th>COLLECTOR</th>
    <th>WORKS COLLECTED</th>
    <th>WORKS OWNED</th>
    <th>AVG. PURCHASE PRICE</th>
    <th>TOTAL PURCHASES</th>
    <th>BIGGEST PURCHASE</th>
    <th>WORKS RESOLD</th>
    <th>AVG. RESALE PRICE</th>
    <th>TOTAL RESALES</th>
  </tr>
  {#each collectors as item}
    <tr class="border-b">
      <td class="py-4">
        <div class="flex">
          <Avatar src={item.avatar_url} />
          <div class="ml-2 my-auto font-bold">
            <a href={`/user/${item.id}`}>@{item.username}</a>
          </div>
        </div>
      </td>
      <td>12</td>
      <td>425</td>
      <td>$2,137</td>
      <td>$25,654</td>
      <td>$4,961</td>
      <td>0</td>
      <td>-</td>
      <td>-</td>
    </tr>
  {/each}
</table>
