<script>
  import Row from "$components/Row";

  export let title;
  export let stat;
  export let link = '/top-collectors';
  export let items = [];
</script>

<style>
  .summary{
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px #cbcbcb;
    padding:40px;
    width: 30%;
    margin: 1.6%;
  }
  .seeAll{
    color: #05B298;
  }

  @media only screen and (max-width: 1280px){
    .summary{
      width:46%;
    }
  }

  @media only screen and (max-width: 800px){
    .summary{
      width: 100%;
      margin-bottom: 40px;
    }
  }
</style>

<div class="w-full px-6 mb-6 summary">
  <div class="bg-white">
    <div class="border-black border-b-2 flex">
      <h1 class="text-xl flex-1 sub-title">{title}</h1>
      <div class="text-right w-1/6 text-xs text-gray-600 uppercase font-thin">{stat}</div>
    </div>
    <div class="py-4">
      {#each items as item}
        <Row {item} />
      {/each}
    </div>
    <div class="text-right uppercase text-sm font-bold seeAll"><a href={link}>See all</a></div>
  </div>
</div>
