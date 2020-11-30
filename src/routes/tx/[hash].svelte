<script context="module">
  export async function preload({ params }) {
    let prefix = "http://localhost:3012";
    if (typeof window !== "undefined") {
      prefix = "/electrs";
    }

    let res = await this.fetch(`${prefix}/tx/${params.hash}`);
    let tx = await res.json();
    return { tx };
  }
</script>

<script>
  export let tx;
</script>

{JSON.stringify(tx)}
