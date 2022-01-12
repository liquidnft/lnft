<script context="module">
  export async function load({ params: { slug }}) {
    return {
      status: 302,
      redirect: `/${params.slug}`,
    };
  }

</script>
