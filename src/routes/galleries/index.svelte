<script>
  import { onMount } from "svelte";
  import { hasura } from "$lib/api";
  import { getTagsWithArtwork } from "$queries/artworks";
  import { Card } from "$comp";
  import galleries from "$lib/galleries";
  import { parseISO, compareAsc } from "date-fns";

  let tags = [];

  onMount(async () => {
    tags = (
      await hasura
        .post({
          query: getTags,
        })
        .json()
    ).data.tags;
  });
</script>

<div class="container mx-auto mt-20">
  <div class="px-8">
    <h2>Galleries</h2>

    {#each Object.keys(galleries) as gallery}
      <h2 class="text-xl mb-6 m-6 px-4">
        <a href={`/galleries/${gallery}`}>{galleries[gallery]}</a>
      </h2>
      <div class="flex flex-wrap">
        {#each tags
          .filter((t) => t.tag.toLowerCase() === gallery && t.artwork)
          .sort( (a, b) => compareAsc(parseISO(b.artwork.created_at), parseISO(a.artwork.created_at)) )
          .slice(0, 3) as tag}
          <div class="w-full lg:w-1/3 px-10 mb-8">
            <Card artwork={tag.artwork} />
          </div>
        {/each}
        <a class="mx-auto secondary-btn mb-20" href={`/galleries/${gallery}`}
          >View gallery</a
        >
      </div>
    {/each}
  </div>
</div>
