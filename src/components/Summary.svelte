<script>
  import { Row } from "$comp";

  export let title;
  export let stat;
  export let link = "/top-collectors";
  export let items = [];
</script>

<div class="w-full md:w-full lg:w-1/2 watch-table">
  <div class="border-gray-400 border-b-2 flex justify-between">
    <p class="text-xl">{title}</p>
    <div class="mb-4">{stat}</div>
  </div>
  <div>
    {#each items as item}
      <Row {item} {link} />
    {/each}
  </div>
  <a class="block text-right" href={link}>See all</a>
</div>

<style>
  .watch-table:nth-child(1) {
    padding-right: 36px;
  }

  .watch-table:nth-child(2) {
    padding-left: 36px;
    padding-right: 36px;
  }

  @media (max-width: 1023px) {
    .watch-table {
      margin-bottom: 72px;
    }
    .watch-table:nth-child(1),
    .watch-table:nth-child(2) {
      padding: 0;
    }
  }
</style>
