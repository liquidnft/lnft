<script>
  import { Summary } from "$comp";
  import { operationStore, subscription } from "@urql/svelte";
  import { getCollectors } from "$queries/users";
  import RecentActivityCard from '$components/RecentActivityCard';

  let collectors = [];
  let getCollectors$ = operationStore(getCollectors);
  subscription(getCollectors$, (a, b) => (collectors = b.collectors));

  $: items = collectors.map(u => ({ user: u, value: u.num_artworks })).splice(0, 3)
</script>

<style>
  .header{
    width: 90%;
    max-width:350px;
  }
  .secondary-header{
    height: 600px;
    background-image: url('/secondary-header.jpg/');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .header-button{
    width: 220px;
    border: 1px solid white;
  }
</style>


<div class="flex mx-auto justify-center">
  <div class="header text-center">
    <h1 class="text-7xl mb-10 font-bold primary-color">Liquid art <br/>project</h1>
    <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. </p>
    <button class="mt-6 my-auto text-center mx-auto brand-color">Start exploring</button>
  </div>
</div>

<div class="flex secondary-header mt-20 mb-20 text-white">
  <div class="container flex mx-auto flex-col justify-center secondary-header-text m-10 pl-6">
    <h2 class="text-5xl font-bold mb-3">Anon artist</h2>
    <p>The artwork</p>
    <button class="button-transparent header-button text-white border mt-10"> More from this artist</button>
  </div>  
</div>

<div class="container mx-auto pl-6 mb-8"><h3 class="primary-color font-bold text-3xl">Recent Activity</h3></div>
<div class="container mx-auto flex flex-wrap mb-20 pb-10">
  <RecentActivityCard 
    name="Cindy"
    time="3 Hours"
    title="Place a bid for about $300 on the white Wizard"
  />
  <RecentActivityCard  
    name="Juan"
    time="2 Hours"
    title="Place a bid for about $300 on the white Wizard"
  />
  <RecentActivityCard 
    name="Selene"
    time="1 Hours"
    title="Place a bid for about $300 on the white Wizard"
  />
  <div class="mx-auto"><button class="button-transparent">See All</button></div>
</div>

<div class="container mx-auto pl-6 mb-10"><h3 class="primary-color font-bold text-3xl">Watch the market move</h3></div>
<div class="container mx-auto flex flex-wrap">
  <Summary title="Top Collectors" stat="Recently Collected" {items} link="/top-collectors" />
  <Summary title="Top Artists" stat="Recent Sales" {items}  link="/top-artists" />
  <Summary title="Largest Collections" stat="Artworks Owned" {items} link="/largest-collections" />
</div>
