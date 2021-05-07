<script>
  import Row from "$components/Row";

  export let title;
  export let stat;
  export let link = "/top-collectors";
  export let items = [];
</script>

<div class="w-full md:w-full lg:w-1/2 sm:pr-10 mb-10">
  <div class="border-gray-400 border-b-2 flex justify-between">
    <p class="text-xl">{title}</p>
    <div class="mb-4">{stat}</div>
  </div>
  <div class="py-4">
    {#each items as item}
      <Row {item} {link} />
    {/each}
  </div>
  <a class="block text-right text-midblue primary-color" href={link}>See
    all</a>
</div>
