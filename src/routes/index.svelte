<script>
  import { Summary } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { getCollectors } from "$queries/users";
  import Button from "smelte/src/components/Button";

  let collectors = [];
  let getCollectors$ = operationStore(getCollectors);
  subscription(getCollectors$, (a, b) => (collectors = b.collectors));

  $: items = collectors.map(u => ({ user: u, value: u.num_artworks })).splice(0, 3)
</script>

<h6 class="mb-3 mt-6">Block</h6>
<div class="py-2">
  <Button color="pink" block>Button</Button>
</div>
<div class="flex flex-wrap md:flex-nowrap">
  <Summary title="Top Collectors" stat="Recently Collected" {items} link="/top-collectors" />
  <Summary title="Top Artists" stat="Recent Sales" {items}  link="/top-artists" />
  <Summary title="Largest Collections" stat="Artworks Owned" {items} link="/largest-collections" />
</div>
