<script context="module">
  export async function load({ fetch }) {
    const props = await fetch(`/activity.json`).then((r) =>
      r.json()
    );

    return {
      props,
    };
  }

</script>

<script>
  import { Activity } from "$comp";
  export let transactions;

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
