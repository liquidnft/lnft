<script context="module">
  export async function load({ params: { slug }}) {
    return {
      status: 302,
      redirect: `/${slug}`,
    };
  }

</script>
