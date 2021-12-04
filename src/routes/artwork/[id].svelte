<script context="module">
  export async function load({ fetch, page }) {
    const props = await fetch(`/artworks/${page.params.id}.json`).then((r) =>
      r.json()
    );

    if (!props.artwork) return {
      status: 404,
    } 

    return {
      status: 302,
      redirect: `/a/${props.artwork.slug}`
    } 
  }

</script>
