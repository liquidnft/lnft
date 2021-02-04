<script>
  import { user } from "$lib/store";
  import { Activity, Avatar } from "$comp";
  import { getTransactions } from "$queries/transactions";
  import { getCollectors } from "$queries/users";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  let collectors = [];
  let getCollectors$ = operationStore(getCollectors);
  subscription(getCollectors$, (a, b) => (collectors = b.collectors));

  let transactions = [];
  subscription(
    operationStore(getTransactions),
    (a, b) => (transactions = b.transactions)
  );
  
</script>


<div class="container mx-auto px-8">
  <h1 class="title">Activity</h1>
  <div class="flex flex-wrap justify-between">
    <div class="w-full lg:max-w-lg">
      {#each transactions as transaction}
        <Activity {transaction} showImage={true} />
      {/each}
    </div>

    <div class="w-1/3">
      <h3 class="sub-title">Top Collectors</h3>
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

      <h3 class="sub-title mt-20">Trending Artists</h3>
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
    </div>
  </div>
</div>