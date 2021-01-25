<script>
  import Row from "$components/Row";

  export let title;
  export let stat;
  export let link = "/top-collectors";
  export let items = [];
</script>

<div class="w-full md:w-full lg:w-1/3 px-6 mb-10">
  <div class="border-gray-400 border-b-2 pb-2 flex">
    <h1 class="text-xl flex-1">{title}</h1>
  </div>
  <div class="text-right w-full mt-2 mb-4">{stat}</div>
  <div class="py-4">
    {#each items as item}
      <Row {item} />
    {/each}
  </div>
  <div class="text-right text-sm font-bold primary-color">
    <a href={link}>See all</a>
  </div>
</div>
