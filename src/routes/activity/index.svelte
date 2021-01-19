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

<style>
  .activity{
    justify-content: center;
  }
  .cards-container{
    width: 40%;
    min-width: 500px;
  }
  .profile-container{
    width:30%;
    margin-left: 10%;
  }
  .top-collectors{
    margin-bottom: 60px;
  }

  @media only screen and (max-width: 770px){
     .cards-container{
       min-width:97%; 
     }

     .profile-container{
       display: none;
     }
  }
</style>

<div>
  <h1 class="title">Activity</h1>
</div>

<div class="container mx-auto flex activity">
  <div class="cards-container">
    {#each transactions as transaction}
      <Activity {transaction} showImage={true} />
    {/each}
  </div>

  <div class="profile-container">
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

    <h3 class="sub-title">Trending Artists</h3>
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
