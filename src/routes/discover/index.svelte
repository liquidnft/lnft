<script>
  import { operationStore, subscription } from "@urql/svelte";
  import { getTags } from "$queries/artworks";
  import { Card } from "$comp";
  import Search from "$components/Search";

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

<div class="container mx-auto mt-20">
  <div class="px-8">
    <h2>Discover</h2>
    <div class="border-b mb-8 mt-10">
      <Search {tags} />
    </div>

    <div class="w-full text-center my-10">
      <h3>Trending Tags</h3>
    </div>
  </div>

  {#each tags as tag}
    <h2 class="text-xl mb-6 m-6 px-4">#{tag.tag}</h2>
  <div class="flex flex-wrap">
    {#each tag.artworks as artwork}
      <div class="w-full lg:w-1/3 px-10 mb-20">
        <Card {artwork} />
      </div>
    {/each}
  </div>
  {/each}
</div>
