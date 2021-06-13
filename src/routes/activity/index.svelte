<script>
  import { user } from "$lib/store";
  import { page } from "$app/stores";
  import { hasura } from "$lib/api";
  import { Activity, Avatar } from "$comp";
  import { getRecentActivity } from "$queries/transactions";
  import { topCollectors } from "$queries/users";
  import { query, operationStore } from "@urql/svelte";

  let transactions = [];
  $: pageChange($page);
  const pageChange = async ({ params }) => {
      transactions = (
        await hasura
          .post({
            query: getRecentActivity(20),
          })
          .json()
      ).data.recentactivity;
  };

  let show = false;
</script>

<style>
  .tabs {
    display: none;
  }
  @media only screen and (max-width: 1023px) {
    .tabs {
      display: flex;
    }
    .hide {
      display: none;
    }
    .showFeed {
      display: none;
    }
    .showRank {
      display: block;
    }
    button {
      font-weight: bold;
    }
    button:focus {
      border-bottom: 2px solid #6ed8e0;
    }
  }
</style>

<div class="container mx-auto my-10 md:my-20">
  <h2>Activity</h2>
  <div class="flex flex-wrap justify-between mt-10 lg:mt-20">
    <!--
    <div class="tabs flex w-full justify-center border-b-2 mb-8">
      <button on:click={() => (show = false)} class="w-1/2 pb-3">Feed</button>
      <button
        on:click={() => (show = true)}
        class="w-1/2 pb-3">Rankings</button>
    </div>
    -->
    <div class:showFeed={show} class="w-full lg:max-w-lg mx-auto">
      {#each transactions as transaction}
        <Activity {transaction} showImage={true} />
      {/each}
    </div>

    <!--
    <div class:showRank={show} class="w-full lg:w-1/3 flex flex-col hide">
      <div class="boxShadow p-4 mb-10 rounded-lg">
        <p>Top Collectors</p>
        <div class="mb-4 top-collectors">
          {#each collectors as collector}
            <div class="flex my-4">
              <Avatar user={collector} />
              <div class="ml-2 my-auto font-bold">
                <a href={`/u/${collector.username}`}>@{collector.username}</a>
              </div>
            </div>
          {/each}
        </div>
        <a
          href="/top-collectors"
          class="text-sm text-midblue block text-right">See full ranking</a>
      </div>

      <div class="boxShadow p-4 rounded-lg">
        <p>Trending Artists</p>
        <div class="mb-4">
          {#each collectors as collector}
            <div class="flex my-4">
              <Avatar user={collector} />
              <div class="ml-2 my-auto font-bold">
                <a href={`/u/${collector.username}`}>@{collector.username}</a>
              </div>
            </div>
          {/each}
        </div>
        <a href="/top-artists" class="text-sm text-midblue block text-right">See
          full ranking</a>
      </div>
    </div>
    -->
  </div>
</div>
