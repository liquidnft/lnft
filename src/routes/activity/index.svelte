<script>
  import { user } from "$lib/store";
  import { page } from "$app/stores";
  import { query } from "$lib/api";
  import { Activity, Avatar } from "$comp";
  import { getRecentActivity } from "$queries/transactions";
  import { topCollectors } from "$queries/users";
  import { err } from "$lib/utils";

  let transactions = [];
  $: init($page);
  let init = () =>
    query(getRecentActivity(20))
      .then((res) => (transactions = res.recentactivity))
      .catch(err);

  let show = false;

</script>

<div class="container mx-auto my-10 md:my-20">
  <h2>Activity</h2>
  <div class="flex flex-wrap justify-between mt-10 lg:mt-20">
    <div class="w-full lg:max-w-lg mx-auto">
      {#each transactions as transaction}
        <Activity {transaction} showImage={true} />
      {/each}
    </div>
  </div>
</div>
