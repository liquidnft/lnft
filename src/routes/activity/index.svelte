<script>
  import { user } from "$lib/store";
  import { Activity, Avatar } from "$comp";
  import { getTransactions } from "$queries/transactions";
  import { topCollectors } from "$queries/users";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  let collectors = [];
  let topCollectors$ = operationStore(topCollectors);
  subscription(topCollectors$, (a, b) => (collectors = b.collectors));

  let transactions = [];
  subscription(
    operationStore(getTransactions),
    (a, b) => (transactions = b.transactions)
  );

  let show = false
  
</script>

<style>
  .tabs{display: none;}
  @media only screen and (max-width: 1023px){
    .tabs{display: flex;}
    .hide{display: none;}
    .showFeed {display: none;}
    .showRank {display: block;}
    button:focus{border-bottom: 2px solid #6ED8E0;}
  }
</style>


<div class="container mx-auto my-10 md:my-20">
  <h2>Activity</h2>
  <div class="flex flex-wrap justify-between mt-10 lg:mt-20">
    <div class="tabs flex w-full justify-center border-b-2 mb-8">
      <button on:click="{() => show = false}" class="w-1/2 pb-3">Feed</button>
      <button on:click="{() => show = true}" class="w-1/2 pb-3">Rankings</button>
    </div>
    <div class:showFeed="{show}" class="w-full lg:max-w-lg">
      {#each transactions as transaction}
        <Activity {transaction} showImage={true} />
      {/each}
    </div>

    <div class:showRank="{show}" class="w-full lg:w-1/3 flex flex-col hide">
      <div class="boxShadow p-4 mb-10 rounded-lg">
        <p>Top Collectors</p>
        <div class="mb-4 top-collectors">
          {#each collectors as collector}
            <div class="flex my-4">
              <Avatar src={collector.avatar_url} />
              <div class="ml-2 my-auto font-bold">
                <a href={`/user/${collector.id}`}>@{collector.username}</a>
              </div>
            </div>
          {/each}
        </div>
        <a href="/" class="text-sm text-midblue block text-right">See full ranking</a>
      </div>

      <div class="boxShadow p-4 rounded-lg">
        <p>Trending Artists</p>
        <div class="mb-4">
          {#each collectors as collector}
            <div class="flex my-4">
              <Avatar src={collector.avatar_url} />
              <div class="ml-2 my-auto font-bold">
                <a href={`/user/${collector.id}`}>@{collector.username}</a>
              </div>
            </div>
          {/each}
        </div>
        <a href="/" class="text-sm text-midblue block text-right">See full ranking</a>
      </div>
    </div>
  </div>
</div>
