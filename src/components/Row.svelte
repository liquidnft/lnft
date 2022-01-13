<script>
  import { goto } from "$lib/utils";
  import { Avatar } from "$comp";

  export let item;
  export let link;
</script>

<div
  on:click={() => goto(link)}
  class="flex flex-wrap border-b cursor-pointer watch-row"
>
  <Avatar user={item.user} />
  <div class="ml-2 my-auto">
    <a href={`/${item.user.username}`}>@{item.user.username}</a>
  </div>
  <div class="my-auto ml-auto text-right">{item.value}</div>
</div>

<style>
  .watch-row {
    padding: 24px 0;
  }
</style>
