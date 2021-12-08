<script context="module">
	export async function load({ error, status }) {
    console.log(error, status);
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>
  export let title;
  console.log(title);
</script>

<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <div class="mx-auto">
    <h2 class="mb-10">Page Not Found</h2>
    <a href="/"> <button class="primary-btn"> Return to homepage</button></a>
  </div>
</div>
