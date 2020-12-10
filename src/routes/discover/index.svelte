<script>
  import { operationStore, subscription } from "@urql/svelte";
  import { getTags } from "$queries/artworks";
  import { Card } from "$comp";

  let tags = [];

  let getTags$ = operationStore(getTags);

  subscription(getTags$, (a, b) => {
    let reduced = [];
    b.tags.map((t) => {
      let i = reduced.find((r) => t.tag === r.tag);
      if (i) i.artworks.push(t.artwork);
      else
        reduced.push({
          tag: t.tag,
          artworks: [t.artwork],
        });
    });
    tags = reduced;
  });
</script>

<h1 class="title">Discover</h1>

<div class="border-b mb-8">
  <input placeholder="Search..." class="border-none border-b w-full outline-none pb-0" />
</div>

<div class="w-full text-center my-12">
  <h1 class="font-bold">Trending Tags</h1>
</div>

{#each tags as tag}
  <h2 class="text-xl mb-6 m-6">#{tag.tag}</h2>
<div class="mb-8 p-2 w-full flex flex-wrap">
  {#each tag.artworks as artwork}
    <div class="px-4 w-full md:w-1/2 lg:w-1/3 mb-9">
      <Card {artwork} />
    </div>
  {/each}
</div>
{/each}
