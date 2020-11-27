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

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">Activity</h1>
</div>

<div class="flex">
  <div class="flex-grow">
    {#each transactions as transaction}
      <Activity {transaction} showImage={true} />
    {/each}
  </div>

  <div class="flex-grow">
    <h1 class="text-xl mb-2">Top Collectors</h1>
    <div class="mb-4">
      {#each collectors as collector}
        <div class="flex my-4">
          <Avatar src={collector.avatar_url} />
          <div class="ml-2 my-auto">
            <a href={`/user/${collector.id}`}>@{collector.username}</a>
          </div>
        </div>
      {/each}
    </div>

    <h1 class="text-xl mb-2">Trending Artists</h1>
    <div class="mb-4">
      {#each collectors as collector}
        <div class="flex my-4">
          <Avatar src={collector.avatar_url} />
          <div class="ml-2 my-auto">
            <a href={`/user/${collector.id}`}>@{collector.username}</a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
