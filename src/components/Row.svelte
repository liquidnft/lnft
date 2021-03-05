<script>
  import { goto } from "$lib/utils";
  import Avatar from "$components/Avatar";

  export let item;
  export let link;
</script>

<div
  on:click={() => goto(link)}
  class="flex flex-wrap mb-4 border-b pb-4 cursor-pointer">
  <Avatar user={item.user} />
  <div class="ml-2 my-auto">
    <a href={`/user/${item.user.id}`}>@{item.user.username}</a>
  </div>
  <div class="my-auto ml-auto text-right">{item.value}</div>
</div>
