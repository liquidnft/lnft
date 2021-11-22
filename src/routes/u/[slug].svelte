<script context="module">
  export async function load({ page }) {
    return {
      status: 302,
      redirect: `/${page.params.slug}`,
    };
  }

</script>
