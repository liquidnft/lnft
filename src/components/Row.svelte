<script>
  import Avatar from "$components/Avatar";

  export let item = {
    user: {
      id: '123',
      avatar_url: null,
      username: "test",
    },
    value: 42,
  };
</script>

<div class="flex flex-wrap mb-4 border-b pb-4">
  <Avatar src={item.user.avatar_url} />
  <div class="ml-2 my-auto">
    <a href={`/user/${item.user.id}`}>@{item.user.username}</a>
  </div>
  <div class="my-auto ml-auto text-right">{item.value}</div>
</div>
