<script context="module">
  export async function preload({ params }) {
    let res = await this.fetch(`http://localhost:3012/tx/${params.hash}`);
    let tx = await res.json();
    return { tx };
  }
</script>

<script>
  export let tx;
</script>

{JSON.stringify(tx)}
