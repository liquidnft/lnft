<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getArtworkBySlug } from "$queries/artworks";
  import { getUserByUsername } from "$queries/users";
  import { operationStore, subscription } from "@urql/svelte";
  import Artwork from "./artwork/[id].svelte";
  import User from "./user/[id].svelte";

  let artwork, user;

  $: subscription(
    operationStore(getArtworkBySlug($page.params.slug)),
    (_, data) => {
      artwork = data.artworks[0];
    }
  );

  $: subscription(
    operationStore(getUserByUsername($page.params.slug)),
    (_, data) => {
      user = data.users[0];
    }
  );
</script>

{#if artwork}
  <Artwork id={artwork.id} />
{:else if user}
  <User subject={user} />
{/if}
