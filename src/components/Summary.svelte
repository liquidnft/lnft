<script>
  import { Row } from "$comp";

  export let title;
  export let stat;
  export let link = '/top-collectors';
  export let items = [];
</script>

<div class="w-full px-6 mb-6">
  <div class="bg-white">
    <div class="border-black border-b-2 flex">
      <h1 class="text-xl flex-1">{title}</h1>
      <div class="text-right w-1/6 text-xs text-gray-600 uppercase font-thin">{stat}</div>
    </div>
    <div class="py-4">
      {#each items as item}
        <Row {item} />
      {/each}
    </div>
    <div class="text-right uppercase text-sm font-bold"><a href={link}>See all</a></div>
  </div>
</div>
