<script>
  import { onMount } from "svelte";
  import { hasura } from "$lib/api";
  import { operationStore, subscription } from "@urql/svelte";
  import { getTags } from "$queries/artworks";
  import { Card } from "$comp";
  import { token } from "$lib/store";

  let tags = [];

  let galleries = ["bitcoin2021"];
  let titles = {
    bitcoin2021: "Bitcoin 2021",
  };

  onMount(async () => {
    if ($token) {
      tags = (
        await hasura
          .auth(`Bearer ${$token}`)
          .post({
            query: getTags,
          })
          .json()
      ).data.tags;
    }
  });
</script>

<div class="container mx-auto mt-20">
  <div class="px-8">
    <h2>Galleries</h2>

    {#each galleries as gallery}
      <h2 class="text-xl mb-6 m-6 px-4">{titles[gallery]}</h2>
      <div class="flex flex-wrap">
        {#each tags.filter((t) => t.tag === gallery) as tag}
          <div class="w-full lg:w-1/3 px-10 mb-20">
            <Card artwork={tag.artwork} />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
