<script>
  import { query } from "$lib/api";
  import { page } from "$app/stores";
  import { getArtworksByTag } from "$queries/artworks";
  import { Card } from "$comp";
  import galleries from "$lib/galleries";
  import { err } from "$lib/utils";

  let { tag } = $page.params;
  let artworks = [];
  $: query(getArtworksByTag(tag))
    .then((res) => (artworks = res.artworks))
    .catch(err);
</script>

<div class="container mx-auto mt-10 md:mt-20">
  {#if tag.toLowerCase() !== "bitcoinbond"}
    <h3 class="mb-10">{galleries[tag] ? galleries[tag] : `#${tag}`}</h3>
  {:else}
    <h3 class="mb-10">The Bitcoin Bond Gallery</h3>

    <div class="card border-l-8">
      <p>
        Raretoshi artists, graphic designers, and memelords from around the
        world have joined forces to honor the historic Bitcoin Bond in El
        Salvador. Like the NFTs on Raretoshi, the bond is issued on the Liquid
        Network, a layer-2 solution that allows the issuance of digital assets
        on top of Bitcoin.
      </p>
      <p>
        El Salvador's adoption of Bitcoin and its layer-2 technologies signal
        the much-anticipated transition away from centralized monetary systems
        to more frictionless, censorship-resistant ones anchored to Bitcoin, the
        hardest asset the world has ever known.
      </p>
    </div>

    <div class="card border-r-8">
      <p>
        If you too are excited about the Bitcoin Bond, what it means for
        humanity's future, and would like to contribute to the Bitcoin Bond
        gallery on Raretoshi, register to become an artist and upload a unique
        1:1 piece of art (future meme lore) with the tag <b>#BitcoinBond</b>.
      </p>
      <p>
        We will keep accepting artwork for the online gallery for as long as
        possible, sharing it with El Salvador President Bukele, Samson Mow, Max
        Keiser, and other architects of the bond.
      </p>
    </div>
  {/if}

  <div class="flex flex-wrap">
    {#each artworks as artwork (artwork.id)}
      <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 pr-6 mb-10">
        <Card {artwork} />
      </div>
    {/each}
  </div>
</div>

<style>
  p {
    @apply mb-4;
  }

  .card {
    @apply border-primary p-4 pl-8 shadow-md mb-12;
  }
</style>
