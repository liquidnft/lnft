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
    <div class:showFeed={show} class="w-full lg:max-w-lg mx-auto">
      {#each transactions as transaction}
        <Activity {transaction} showImage={true} />
      {/each}
    </div>
  </div>
</div>
