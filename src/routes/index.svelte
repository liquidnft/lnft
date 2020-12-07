<script>
  import { Summary } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { getCollectors } from "$queries/users";

  let collectors = [];
  let getCollectors$ = operationStore(getCollectors);
  subscription(getCollectors$, (a, b) => (collectors = b.collectors));

  $: items = collectors.map(u => ({ user: u, value: u.num_artworks })).splice(0, 3)
</script>

<div class="flex flex-wrap">
  <Summary title="Top Collectors" stat="Recently Collected" {items} link="/top-collectors" />
  <Summary title="Top Artists" stat="Recent Sales" {items}  link="/top-artists" />
  <Summary title="Largest Collections" stat="Artworks Owned" {items} link="/largest-collections" />
</div>
