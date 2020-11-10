<script context="module">
	export async function preload({ params }) {
    // const res = await this.fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`);
    // const item = await res.json();

    let { id } = params;

		return { id };
	}
</script>

<script>
  export let id;
</script>

<h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">#{id}</h1>

